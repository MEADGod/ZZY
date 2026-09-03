# Robinhood MCP Integration

ZZY targets Robinhood Agentic Trading through the official Robinhood MCP server.

The current adapter is intentionally disabled because no authenticated MCP capability inventory is available in this repository.

Before implementation:

1. Confirm the user is eligible for Robinhood Agentic Trading.
2. Create or select a dedicated Agentic Account.
3. Connect through Robinhood's official authorization flow.
4. Inspect the exact tools and schemas exposed by the MCP server.
5. Implement only those verified tools.
6. Keep credentials outside source control.
7. Test market reads, order previews, order submission, and status reconciliation separately.

Never invent tool names, account fields, order types, or execution guarantees.
