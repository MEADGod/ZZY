export class RobinhoodMcpAdapter {
  constructor(){this.mode='disabled';}
  async listCapabilities(){throw new Error('Official Robinhood MCP integration is not configured.');}
  async getCryptoMarketSnapshot(){throw new Error('Live Robinhood market-data access is not implemented. Use a labeled local fixture.');}
  async prepareOrder(){throw new Error('Robinhood order preparation is structurally disabled until official MCP tools are connected and reviewed.');}
  async getOrderStatus(){throw new Error('Robinhood order reconciliation is not implemented.');}
}
