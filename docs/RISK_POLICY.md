# ZZY Risk Policy

ZZY defaults to preview-only mode and fails closed.

## Mandatory Blocks

- Missing or malformed source data
- Stale observation
- Unsupported or unknown asset
- Price movement beyond the configured tolerance
- Existing-order limit reached
- Total exposure limit reached
- Missing Agentic Account
- Sample or fixture data

## Live Readiness

Live order submission requires an eligible Robinhood account, a dedicated Agentic Account, official MCP authorization, exact tool-schema validation, bounded order settings, durable idempotency, and order-state reconciliation.
