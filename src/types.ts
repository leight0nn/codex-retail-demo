export type FulfillmentMode = "pickup" | "ship";
export type InventorySourceSystem = "STORE_POS" | "WMS" | "ERP_BATCH";
export type AvailabilityStatus = "OK" | "DEGRADED";
export type AvailabilityErrorCode = "NO_FRESH_DATA" | "INSUFFICIENT_QTY" | "INVALID_REQUEST";

export interface InventoryRecord {
  sku: string;
  locationId: string;
  locationType: "STORE" | "DC";
  onHandQty: number;
  reservedQty: number;
  safetyStockQty: number;
  lastUpdatedAt: string;
  sourceSystem: InventorySourceSystem;
  feedLagMinutes: number;
  isCycleCountPending: boolean;
  pickupRank: number;
  shipRank: number;
}

export interface AvailabilityRequest {
  sku: string;
  quantity: number;
  mode: FulfillmentMode;
  preferredLocationId?: string;
  maxRecordAgeMinutes?: number;
}

export interface LocationAvailability {
  locationId: string;
  locationType: "STORE" | "DC";
  sourceSystem: InventorySourceSystem;
  availableQty: number;
  rank: number;
  isFresh: boolean;
  observedAgeMinutes: number;
  feedLagMinutes: number;
  effectiveAgeMinutes: number;
  reason?: string;
}

export interface AvailabilityResponse {
  sku: string;
  requestedQty: number;
  mode: FulfillmentMode;
  correlationId?: string;
  isAvailable: boolean;
  chosenLocation?: LocationAvailability;
  alternatives: LocationAvailability[];
  evaluatedAt: string;
  status: AvailabilityStatus;
  errorCode?: AvailabilityErrorCode;
  notes: string[];
}
