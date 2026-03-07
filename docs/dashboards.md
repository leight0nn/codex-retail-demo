# Dashboard Definitions

## 1) OpenAI Customer Success Rollout Dashboard

**Audience:** OpenAI customer success and enablement teams.

### Sections
- **Rollout Health**
  - Weekly active users by team
  - New-user activation funnel (invited -> first prompt -> first accepted suggestion)
  - Session volume trend (4-week)

- **Capability Adoption**
  - Prompt category mix (`understanding`, `generation`, `refactor`, `test`, `docs`)
  - % interactions with file-grounded responses
  - Top repositories by Codex usage

- **Value Signals**
  - Median cycle time by category
  - Suggestion acceptance rate trend
  - Self-reported developer satisfaction (pulse score)

- **Risk & Governance**
  - Policy flag rate and trend
  - Escalation queue size and age
  - Teams with repeated policy exceptions

## 2) Customer Stakeholder Dashboard (Director of Engineering + VP of IT)

**Audience:** Engineering and IT leadership at the customer.

### Sections
- **Business Outcome Snapshot**
  - Engineering hours saved (modeled)
  - Throughput lift (tasks completed per sprint)
  - Time-to-understand legacy code reduction

- **Engineering Quality & Delivery**
  - Test-added or test-updated rate for AI-assisted changes
  - Mean PR review turnaround
  - Defect escape proxy (post-merge rollback/patch rate)

- **Risk, Compliance, and Trust**
  - Policy incident trend and severity
  - % sessions with governance-safe settings enabled
  - Audit completeness for Codex-assisted commits

- **Enablement Progress**
  - Team adoption heatmap
  - Training completion vs usage depth
  - Top requested enablement topics

## Dashboard Design Principles

- Keep executive views aggregate-first and avoid developer-level surveillance optics.
- Distinguish measured metrics vs modeled estimates.
- Include a plain-language caveat section for synthetic pilot limitations.
