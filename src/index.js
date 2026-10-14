
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/status") {
      return Response.json({
        app: "Remie Trades",
        status: "online",
        tradingConnected: false,
        liveTradingEnabled: false,
        message: "Dashboard ready. Deriv API not connected."
      });
    }

    return env.ASSETS.fetch(request);
  }
};
