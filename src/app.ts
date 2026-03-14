import express from "express";
import { randomUUID } from "crypto";
import { AvailabilityService } from "./availabilityService";
import { InventoryRepository } from "./inventoryRepository";
import { AvailabilityRequest } from "./types";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const repository = new InventoryRepository();
const service = new AvailabilityService();

app.use(express.json());

app.post("/availability", (req, res) => {
  const payload = req.body as AvailabilityRequest;
  const correlationId = randomUUID();

  if (!payload?.sku || !payload?.mode || typeof payload?.quantity !== "number") {
    return res.status(400).json({
      status: "DEGRADED",
      errorCode: "INVALID_REQUEST",
      correlationId,
      message: "Invalid request. Required: sku, quantity, mode."
    });
  }

  // Potential edge case: quantity=0 currently returns true if any record exists.
  const inventory = repository.getBySku(payload.sku);
  const response = service.evaluate(payload, inventory);
  return res.json({
    ...response,
    correlationId
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`inventory-availability-service listening on port ${port}`);
  });
}

export { app };
