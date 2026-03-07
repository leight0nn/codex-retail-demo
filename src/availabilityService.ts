import {
  AvailabilityRequest,
  AvailabilityResponse,
  InventoryRecord,
  LocationAvailability
} from "./types";

const DEFAULT_MAX_RECORD_AGE_MINUTES = 20;

export class AvailabilityService {
  evaluate(request: AvailabilityRequest, inventory: InventoryRecord[]): AvailabilityResponse {
    const maxAgeMinutes = request.maxRecordAgeMinutes ?? DEFAULT_MAX_RECORD_AGE_MINUTES;
    const now = new Date();

    const scoredLocations = inventory
      .filter((row) => this.supportsMode(row, request.mode))
      .map((row) => this.toLocationAvailability(row, request.mode, maxAgeMinutes, now))
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

    return {
      sku: request.sku,
      requestedQty: request.quantity,
      mode: request.mode,
      isAvailable: Boolean(chosenLocation),
      chosenLocation,
      alternatives: scoredLocations,
      evaluatedAt: now.toISOString(),
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
    maxAgeMinutes: number,
    now: Date
  ): LocationAvailability {
    const availableQty = Math.max(0, row.onHandQty - row.reservedQty - row.safetyStockQty);
    const ageMinutes = (now.getTime() - new Date(row.lastUpdatedAt).getTime()) / 60000;
    const isFresh = ageMinutes <= maxAgeMinutes;

    return {
      locationId: row.locationId,
      locationType: row.locationType,
      availableQty,
      rank: mode === "pickup" ? row.pickupRank : row.shipRank,
      isFresh,
      reason: isFresh ? undefined : `stale snapshot (${Math.floor(ageMinutes)}m old)`
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
}
