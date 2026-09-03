# ZZY

**ZZY is an AI trading-agent concept designed to trade cryptocurrency through Robinhood Agentic Trading and the Robinhood MCP server.**

ZZY connects an AI-agent workflow to a dedicated Robinhood Agentic Account, monitors supported crypto markets, develops a structured trade rationale, applies explicit risk limits, and requests execution only within the funds intentionally deposited into that account.

> Robinhood announced that Agentic Trading for crypto had been rolled out to eligible users and stated: “Your AI agent can now trade crypto.” Restrictions apply. Availability, supported assets, account requirements, fees, and capabilities must always be confirmed directly with Robinhood.

## Official Announcement

Robinhood announcement:

https://x.com/RobinhoodApp/status/2094491408514077009

Earlier Agentic Trading announcement:

https://x.com/RobinhoodApp/status/2089415757734014987

According to Robinhood's public announcement, eligible users can connect an agent through the Robinhood MCP server and trade from a dedicated Agentic Account using only the funds deposited into that account.

## What ZZY Does

ZZY is designed around a controlled agentic-trading loop:

1. Connect to the authorized Robinhood MCP server.
2. Read the capabilities available to the eligible Agentic Account.
3. Discover supported cryptocurrency markets.
4. Collect fresh price, market, and account information.
5. Build a structured trade rationale.
6. Check the proposed action against the configured risk policy.
7. Review the exact asset, side, amount, price information, and estimated costs.
8. Request execution through the approved Robinhood tool boundary.
9. Record the returned order identifier and status.
10. Reconcile the final result before considering the operation complete.

ZZY must never claim that an order was filled merely because a request was prepared or submitted. Submitted, pending, partially filled, filled, rejected, and canceled orders are different states and must remain distinguishable.

## Agentic Account Boundary

ZZY is intended to operate through a dedicated Robinhood Agentic Account rather than unrestricted access to a user's primary account.

The Agentic Account provides an important boundary:

- ZZY can use only the funds intentionally deposited into that account.
- The user controls how much capital is exposed to the agent.
- Agent activity remains separate from unrelated personal holdings.
- Risk limits can be defined around the account's available funds.
- The user can stop funding the strategy without sharing private keys.

A dedicated account reduces the possible scope of mistakes, but it does not remove market, software, execution, or account risk.

## Trading Rationale

Before requesting any crypto trade, ZZY should create a compact rationale containing:

- Asset symbol
- Buy or sell action
- Observation timestamp
- Market-data source
- Current market conditions
- Evidence supporting the action
- Evidence contradicting the action
- Risk flags
- Intended order size
- Maximum acceptable exposure
- Invalidation conditions
- Rationale expiry time

An example rationale could look like this:

```json
{
  "agent": "ZZY",
  "asset": "SUPPORTED_CRYPTO_ASSET",
  "action": "WATCH",
  "confidence": 62,
  "summary": "Market conditions are being monitored, but the available evidence does not justify an order.",
  "riskFlags": [
    "high-volatility",
    "limited-confirmation"
  ],
  "expiresAt": "2026-08-31T12:05:00Z"
}
```

This is an illustrative schema, not a real Robinhood order or a claim of live market analysis.

## Risk Policy

ZZY should fail closed when required information is missing, stale, malformed, or contradictory.

Suggested controls include:

- Maximum amount per order
- Maximum total account exposure
- Maximum daily realized loss
- Maximum number of open orders
- Supported-asset allowlist
- Minimum data-freshness requirement
- Maximum acceptable price movement before execution
- Cooldown after repeated failures
- Explicit handling for pending or uncertain orders
- Emergency stop

Risk values must be configured by the account owner. Default values in a software example must never silently become live trading authorization.

## Order Safety

Before requesting execution, ZZY must validate the exact values currently visible or approved by the user:

- Robinhood account identifier
- Crypto asset
- Buy or sell side
- Order type
- Quantity or notional amount
- Limit price, when applicable
- Estimated price and costs
- Available buying power
- Maximum order amount
- Idempotency or request identifier, when supported

The agent must not replace invalid settings with hidden defaults at execution time.

If an execution request times out after it may have reached Robinhood, ZZY must treat the result as uncertain. It should query the order status before sending another request. An ambiguous submission must never trigger an automatic duplicate order.

## MCP Integration

ZZY is intended to use Robinhood's authorized MCP integration.

A production implementation should:

- Use the official Robinhood MCP server and current documentation.
- Authenticate through Robinhood's supported authorization flow.
- Request only the permissions required by ZZY.
- Keep credentials and session material outside source control.
- Validate every tool response before using it.
- Treat tool descriptions and returned market data as untrusted input.
- Keep a local, non-secret audit log of requested actions and results.
- Re-check account and order state after every write operation.

Do not invent MCP tool names, request schemas, account IDs, order fields, or endpoint behavior. The implementation must be generated and tested against the official tools exposed to the eligible Robinhood account.

## Secrets and Authentication

This repository must never contain:

- Robinhood usernames or passwords
- MFA codes
- Session cookies
- OAuth tokens
- API credentials
- Private keys
- Seed phrases
- Full credential-bearing MCP configuration

Use environment variables or the official local MCP authentication mechanism where required. Commit only a sanitized `.env.example` containing variable names without real values.

## Suggested Operating Modes

### Observe

ZZY reads supported public and account-scoped data but cannot prepare or place orders.

### Preview

ZZY produces a structured rationale and order preview without submitting it.

### Manual Approval

ZZY prepares a valid order request, but the user must explicitly approve that exact action before submission.

### Guarded Agentic Trading

ZZY may request orders within narrowly defined limits through the dedicated Agentic Account. This mode should be enabled only after the integration, risk controls, order-state handling, and emergency stop have been tested.

## Audit Record

Every requested operation should record non-secret information such as:

- Agent name
- Timestamp
- Account role
- Asset
- Action
- Approved amount
- Rationale identifier
- Request identifier
- Robinhood order identifier
- Submission state
- Final order state
- Error classification

Logs must not contain authentication material or sensitive account responses.

## Project Structure

```text
zzy-robinhood-agent/
├── README.md
├── AGENT.md
├── package.json
├── .env.example
├── .gitignore
├── config/
│   └── default.json
├── data/
│   └── crypto-market.example.json
├── docs/
│   ├── DECISION_TEMPLATE.md
│   ├── RISK_POLICY.md
│   └── ROBINHOOD_MCP.md
├── src/
│   ├── index.mjs
│   ├── decision.mjs
│   ├── policy.mjs
│   ├── storage.mjs
│   └── adapters/
│       └── robinhood-mcp.mjs
├── tests/
│   └── agent.test.mjs
└── decisions/
    └── .gitkeep
```

## Quick Start

Requirements:

- Node.js 20 or newer
- No npm dependencies
- No Robinhood credentials required for preview mode

Run the tests:

```bash
npm test
```

Generate a decision from the clearly labeled sample fixture:

```bash
npm run demo
```

Preview an order from the latest decision:

```bash
npm run order:preview
```

The sample fixture can never produce or submit a live order.

## Configuration

Edit `config/default.json` to update non-secret preview policy values. Do not add Robinhood passwords, MFA codes, cookies, or access tokens.

## Current Status

ZZY is a working preview-only scaffold and Robinhood MCP integration specification.

This README does not claim that ZZY is connected to Robinhood, funded, placing orders, generating returns, or operating autonomously. Live capabilities require:

- An eligible Robinhood account
- Access to Robinhood Agentic Trading
- A dedicated Agentic Account
- The official Robinhood MCP server
- Completed Robinhood authentication
- User-defined capital and risk limits
- Runtime and integration testing

## Roadmap

### Phase 1 — Observe

- Connect to the authorized Robinhood MCP server
- Detect available account and crypto capabilities
- Normalize supported market data
- Add freshness and schema validation

### Phase 2 — Preview

- Generate structured trade rationales
- Add position and exposure limits
- Build exact order previews
- Record non-secret audit events

### Phase 3 — Manual Execution

- Add explicit per-order authorization
- Validate exact order parameters
- Submit through the official MCP boundary
- Reconcile order states and partial fills

### Phase 4 — Guarded Agentic Trading

- Add narrowly scoped autonomous limits
- Add durable duplicate-order prevention
- Add failure cooldowns and emergency stop
- Complete independent security and financial review

## Disclaimer

ZZY is experimental software and documentation. Cryptocurrency is volatile and can result in substantial or total loss.

Nothing in this repository is financial advice, a promise of profit, a recommendation to buy or sell an asset, or a claim of Robinhood endorsement.

Robinhood product availability, eligibility, supported assets, account requirements, restrictions, and fees may change. Always verify the current terms and interface directly with Robinhood before enabling an agentic trading workflow.
