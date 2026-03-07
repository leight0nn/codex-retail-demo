import { AvailabilityService } from "../src/availabilityService";
import { AvailabilityRequest, InventoryRecord } from "../src/types";

const now = Date.now();

const inventory: InventoryRecord[] = [
  {
    sku: "SKU-100",
    locationId: "STORE-001",
    locationType: "STORE",
    onHandQty: 8,
    reservedQty: 2,
    safetyStockQty: 1,
    lastUpdatedAt: new Date(now - 2 * 60 * 1000).toISOString(),
    pickupRank: 1,
    shipRank: 5
  },
  {
    sku: "SKU-100",
    locationId: "DC-ATL",
    locationType: "DC",
    onHandQty: 100,
    reservedQty: 10,
    safetyStockQty: 5,
    lastUpdatedAt: new Date(now - 3 * 60 * 1000).toISOString(),
    pickupRank: 99,
    shipRank: 1
  },
  {
    sku: "SKU-100",
    locationId: "STORE-LEGACY",
    locationType: "STORE",
    onHandQty: 40,
    reservedQty: 5,
    safetyStockQty: 2,
    lastUpdatedAt: new Date(now - 90 * 60 * 1000).toISOString(),
    pickupRank: 2,
    shipRank: 4
  }
];

describe("AvailabilityService", () => {
  const service = new AvailabilityService();

  test("chooses best pickup location from fresh stores", () => {
    const request: AvailabilityRequest = { sku: "SKU-100", quantity: 3, mode: "pickup" };
    const result = service.evaluate(request, inventory);

    expect(result.isAvailable).toBe(true);
    expect(result.chosenLocation?.locationId).toBe("STORE-001");
  });

  test("allows shipping from DC", () => {
    const request: AvailabilityRequest = { sku: "SKU-100", quantity: 20, mode: "ship" };
    const result = service.evaluate(request, inventory);

    expect(result.isAvailable).toBe(true);
    expect(result.chosenLocation?.locationId).toBe("DC-ATL");
  });

  test("marks stale records and excludes them from primary selection", () => {
    const request: AvailabilityRequest = { sku: "SKU-100", quantity: 30, mode: "pickup" };
    const result = service.evaluate(request, inventory);

    expect(result.isAvailable).toBe(false);
    expect(result.alternatives.find((item) => item.locationId === "STORE-LEGACY")?.isFresh).toBe(false);
  });
});
