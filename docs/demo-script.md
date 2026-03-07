# Codex Demo Script: inventory-availability-service

This walkthrough is designed for code-understanding demonstrations in a low-risk, synthetic enterprise context.

## 5 Live Codex Prompts

1. **"Trace how a POST /availability request flows through the code and identify the key decision points."**
2. **"Explain how available quantity is calculated and list any assumptions that could cause overselling or underselling."**
3. **"Find all logic related to stale inventory snapshots and propose one safer fallback strategy."**
4. **"Compare pickup vs ship ranking behavior and suggest a refactor that keeps behavior identical but improves readability."**
5. **"Generate a risk memo for leadership: what this code does well, what it intentionally omits, and what should be productionized next."**

## Suggested Live Flow

1. Open `src/app.ts` and ask Codex for a request-path summary.
2. Open `src/availabilityService.ts` and ask Codex to explain ranking + freshness logic.
3. Open `test/availabilityService.test.ts` to validate understanding via tests.
4. Open `docs/telemetry-spec.md` and discuss governance instrumentation.
