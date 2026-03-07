export type FulfillmentMode = "pickup" | "ship";

export interface InventoryRecord {
  sku: string;
  locationId: string;
  locationType: "STORE" | "DC";
  onHandQty: number;
  reservedQty: number;
  safetyStockQty: number;
  lastUpdatedAt: string;
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
  availableQty: number;
  rank: number;
  isFresh: boolean;
  reason?: string;
}

export interface AvailabilityResponse {
  sku: string;
  requestedQty: number;
  mode: FulfillmentMode;
  isAvailable: boolean;
  chosenLocation?: LocationAvailability;
  alternatives: LocationAvailability[];
  evaluatedAt: string;
  notes: string[];
}
