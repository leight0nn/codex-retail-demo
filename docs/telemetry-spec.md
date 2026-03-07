# Telemetry Spec for Codex Enablement Pilot

## Purpose
Measure Codex adoption, productivity impact, and policy risk in a synthetic enterprise codebase.

## Event: `codex.interaction`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| event_id | string (uuid) | yes | Unique event identifier |
| timestamp_utc | string (ISO-8601) | yes | Event creation time |
| user_id_hash | string | yes | Pseudonymous engineer identifier |
| team_id | string | yes | Owning team or org unit |
| repo_name | string | yes | Repository context (`codex-retail-demo`) |
| session_id | string | yes | Codex session correlation id |
| prompt_category | enum | yes | `understanding`, `generation`, `refactor`, `test`, `docs`, `other` |
| prompt_tokens | integer | yes | Prompt token count |
| completion_tokens | integer | yes | Completion token count |
| files_referenced_count | integer | no | Number of files cited by Codex |
| suggested_changes_count | integer | no | Number of code suggestions generated |
| accepted_changes_count | integer | no | Number of suggestions accepted by user |
| task_cycle_time_seconds | integer | no | Time from prompt to user acceptance |
| policy_flag | enum | yes | `none`, `sensitive_data`, `unsafe_code`, `license_risk`, `other` |
| policy_flag_details | string | no | Human-readable rationale for flag |
| escalation_required | boolean | yes | Whether governance review is required |

## Derived KPIs

- **Adoption**
  - Weekly active Codex users
  - Prompts per engineer per week
  - Repo coverage (% of teams using Codex in scoped repos)

- **Productivity**
  - Median task cycle time reduction vs baseline
  - Acceptance rate (`accepted_changes_count / suggested_changes_count`)
  - Documentation throughput (docs-related prompt volume)

- **Policy Risk**
  - Policy flag rate per 100 interactions
  - Escalation rate by team
  - Time-to-resolution for escalated sessions

## Governance Notes

- This spec intentionally excludes customer identifiers, payment data, and source code payload capture.
- Keep raw prompt retention short-lived and configurable for legal review.
- Export only aggregated metrics for executive reporting.
