# codex-retail-demo

A synthetic Node.js + TypeScript microservice for enterprise Codex enablement walkthroughs.

## Why this repo exists

`inventory-availability-service` is intentionally designed as a **low-risk pilot artifact**:
- realistic retail inventory decisioning logic
- enough complexity for meaningful code-understanding prompts
- no real customer data, secrets, or payment logic

The goal is demo-readability over production completeness.

## What it does

The service exposes `POST /availability` and evaluates inventory availability using:
- on-hand quantity
- reserved quantity
- safety stock
- freshness/staleness checks
- fulfillment-mode-aware ranking (pickup vs ship)
- multiple locations (stores and distribution centers)

## Project structure

- `src/app.ts` – Express API surface
- `src/availabilityService.ts` – core decision logic
- `src/inventoryRepository.ts` – mock data repository
- `src/types.ts` – shared data contracts
- `test/availabilityService.test.ts` – unit tests
- `mock-data/inventory.json` – synthetic inventory data
- `docs/` – demo prompts, telemetry, and dashboard definitions

## Setup

```bash
npm install
npm run dev
```

Service defaults to `http://localhost:3000`.

### Example request

```bash
curl -X POST http://localhost:3000/availability \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "SKU-100",
    "quantity": 2,
    "mode": "pickup",
    "preferredLocationId": "STORE-001"
  }'
```

## NPM scripts

- `npm run dev` – run via ts-node
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run compiled app
- `npm test` – run Jest tests
- `npm run lint` – TypeScript type check (no emit)

## Demo-friendly characteristics

- inline comments call out legacy assumptions and edge cases
- clear separation between API wiring and business logic
- docs include guided Codex prompts + telemetry/governance framing
