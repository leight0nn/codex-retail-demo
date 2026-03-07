import fs from "fs";
import path from "path";
import { InventoryRecord } from "./types";

export class InventoryRepository {
  private readonly dataPath: string;

  constructor(dataPath?: string) {
    this.dataPath = dataPath ?? path.join(__dirname, "..", "mock-data", "inventory.json");
  }

  getBySku(sku: string): InventoryRecord[] {
    const raw = fs.readFileSync(this.dataPath, "utf-8");
    const rows = JSON.parse(raw) as InventoryRecord[];

    // Legacy assumption: SKU matching has historically been case-insensitive across channels.
    return rows.filter((row) => row.sku.toLowerCase() === sku.toLowerCase());
  }
}
