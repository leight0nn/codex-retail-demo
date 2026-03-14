import {
  AvailabilityErrorCode,
  AvailabilityRequest,
  AvailabilityResponse,
  InventoryRecord,
  InventorySourceSystem,
  LocationAvailability
} from "./types";

const DEFAULT_MAX_RECORD_AGE_MINUTES = 20;
const DEFAULT_MAX_RECORD_AGE_BY_SOURCE: Record<InventorySourceSystem, number> = {
  STORE_POS: 15,
  WMS: 30,
  ERP_BATCH: 120
};

export class AvailabilityService {
  evaluate(request: AvailabilityRequest, inventory: InventoryRecord[]): AvailabilityResponse {
    const now = new Date();

    const scoredLocations = inventory
      .filter((row) => this.supportsMode(row, request.mode))
      .map((row) => this.toLocationAvailability(row, request.mode, request.maxRecordAgeMinutes, now))
      .sort((a, b) => a.rank - b.rank);

    // Legacy behavior: keep stale locations in alternatives for operator visibility.
    const freshLocations = scoredLocations.filter((location) => location.isFresh);
    const candidatePool = request.preferredLocationId
      ? this.applyPreferredLocationBias(freshLocations, request.preferredLocationId)
      : freshLocations;

    const chosenLocation = candidatePool.find((location) => location.availableQty >= request.quantity);

    const notes: string[] = [];
    if (freshLocations.length === 0) {
      notes.push("No fresh inventory snapshots available.");
    }
    if (!chosenLocation) {
      notes.push("No location can fully satisfy requested quantity.");
    }

    const errorCode = this.resolveErrorCode(freshLocations.length, Boolean(chosenLocation));
    return {
      sku: request.sku,
      requestedQty: request.quantity,
      mode: request.mode,
      isAvailable: Boolean(chosenLocation),
      chosenLocation,
      alternatives: scoredLocations,
      evaluatedAt: now.toISOString(),
      status: errorCode ? "DEGRADED" : "OK",
      errorCode,
      notes
    };
  }

  private supportsMode(row: InventoryRecord, mode: AvailabilityRequest["mode"]): boolean {
    if (mode === "pickup") {
      return row.locationType === "STORE";
    }
    return true;
  }

  private toLocationAvailability(
    row: InventoryRecord,
    mode: AvailabilityRequest["mode"],
    maxRecordAgeMinutes: number | undefined,
    now: Date
  ): LocationAvailability {
    const availableQty = Math.max(0, row.onHandQty - row.reservedQty - row.safetyStockQty);
    const observedAgeMinutes = (now.getTime() - new Date(row.lastUpdatedAt).getTime()) / 60000;
    const effectiveAgeMinutes = observedAgeMinutes + row.feedLagMinutes;
    const maxAgeMinutes =
      maxRecordAgeMinutes ??
      DEFAULT_MAX_RECORD_AGE_BY_SOURCE[row.sourceSystem] ??
      DEFAULT_MAX_RECORD_AGE_MINUTES;
    const isFresh = effectiveAgeMinutes <= maxAgeMinutes && !row.isCycleCountPending;
    const staleReasons: string[] = [];

    if (effectiveAgeMinutes > maxAgeMinutes) {
      staleReasons.push(
        `stale snapshot (${Math.floor(effectiveAgeMinutes)}m effective age, ${row.sourceSystem})`
      );
    }
    if (row.isCycleCountPending) {
      staleReasons.push("location in cycle count hold");
    }

    return {
      locationId: row.locationId,
      locationType: row.locationType,
      sourceSystem: row.sourceSystem,
      availableQty,
      rank: mode === "pickup" ? row.pickupRank : row.shipRank,
      isFresh,
      observedAgeMinutes: Number(observedAgeMinutes.toFixed(2)),
      feedLagMinutes: row.feedLagMinutes,
      effectiveAgeMinutes: Number(effectiveAgeMinutes.toFixed(2)),
      reason: isFresh ? undefined : staleReasons.join("; ")
    };
  }

  private applyPreferredLocationBias(
    locations: LocationAvailability[],
    preferredLocationId: string
  ): LocationAvailability[] {
    return [...locations].sort((a, b) => {
      if (a.locationId === preferredLocationId) {
        return -1;
      }
      if (b.locationId === preferredLocationId) {
        return 1;
      }
      return a.rank - b.rank;
    });
  }

  private resolveErrorCode(
    freshLocationCount: number,
    hasChosenLocation: boolean
  ): AvailabilityErrorCode | undefined {
    if (hasChosenLocation) {
      return undefined;
    }
    if (freshLocationCount === 0) {
      return "NO_FRESH_DATA";
    }
    return "INSUFFICIENT_QTY";
  }
}
