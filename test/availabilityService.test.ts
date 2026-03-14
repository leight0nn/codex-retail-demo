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
    sourceSystem: "STORE_POS",
    feedLagMinutes: 1,
    isCycleCountPending: false,
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
    sourceSystem: "WMS",
    feedLagMinutes: 4,
    isCycleCountPending: false,
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
    sourceSystem: "STORE_POS",
    feedLagMinutes: 3,
    isCycleCountPending: false,
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
    expect(result.status).toBe("OK");
    expect(result.errorCode).toBeUndefined();
    expect(result.chosenLocation?.locationId).toBe("STORE-001");
  });

  test("allows shipping from DC", () => {
    const request: AvailabilityRequest = { sku: "SKU-100", quantity: 20, mode: "ship" };
    const result = service.evaluate(request, inventory);

    expect(result.isAvailable).toBe(true);
    expect(result.status).toBe("OK");
    expect(result.chosenLocation?.locationId).toBe("DC-ATL");
  });

  test("marks stale records and returns insufficient quantity degradation", () => {
    const request: AvailabilityRequest = { sku: "SKU-100", quantity: 30, mode: "pickup" };
    const result = service.evaluate(request, inventory);

    expect(result.isAvailable).toBe(false);
    expect(result.status).toBe("DEGRADED");
    expect(result.errorCode).toBe("INSUFFICIENT_QTY");
    expect(result.alternatives.find((item) => item.locationId === "STORE-LEGACY")?.isFresh).toBe(false);
  });

  test("applies source-aware freshness windows", () => {
    const sourceAwareInventory: InventoryRecord[] = [
      {
        sku: "SKU-300",
        locationId: "STORE-STALE",
        locationType: "STORE",
        onHandQty: 15,
        reservedQty: 0,
        safetyStockQty: 0,
        lastUpdatedAt: new Date(now - 16 * 60 * 1000).toISOString(),
        sourceSystem: "STORE_POS",
        feedLagMinutes: 0,
        isCycleCountPending: false,
        pickupRank: 1,
        shipRank: 4
      },
      {
        sku: "SKU-300",
        locationId: "DC-FRESH",
        locationType: "DC",
        onHandQty: 15,
        reservedQty: 0,
        safetyStockQty: 0,
        lastUpdatedAt: new Date(now - 20 * 60 * 1000).toISOString(),
        sourceSystem: "WMS",
        feedLagMinutes: 0,
        isCycleCountPending: false,
        pickupRank: 99,
        shipRank: 1
      }
    ];

    const request: AvailabilityRequest = { sku: "SKU-300", quantity: 1, mode: "ship" };
    const result = service.evaluate(request, sourceAwareInventory);

    expect(result.isAvailable).toBe(true);
    expect(result.chosenLocation?.locationId).toBe("DC-FRESH");
    expect(result.alternatives.find((item) => item.locationId === "STORE-STALE")?.isFresh).toBe(false);
  });

  test("returns no fresh data when cycle count hold blocks all candidates", () => {
    const blockedInventory: InventoryRecord[] = [
      {
        sku: "SKU-400",
        locationId: "STORE-ON-HOLD",
        locationType: "STORE",
        onHandQty: 50,
        reservedQty: 0,
        safetyStockQty: 0,
        lastUpdatedAt: new Date(now - 2 * 60 * 1000).toISOString(),
        sourceSystem: "STORE_POS",
        feedLagMinutes: 1,
        isCycleCountPending: true,
        pickupRank: 1,
        shipRank: 10
      }
    ];

    const request: AvailabilityRequest = { sku: "SKU-400", quantity: 1, mode: "pickup" };
    const result = service.evaluate(request, blockedInventory);

    expect(result.isAvailable).toBe(false);
    expect(result.status).toBe("DEGRADED");
    expect(result.errorCode).toBe("NO_FRESH_DATA");
  });
});
