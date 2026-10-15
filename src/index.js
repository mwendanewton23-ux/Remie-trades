
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const json = (data, status = 200) =>
      Response.json(data, { status, headers: cors });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/api/status") {
      return json({
        app: "Remie Trades",
        status: "online",
        mode: env.TRADING_MODE || "DEMO",
        tradingConnected: false,
        liveTradingEnabled: false,
        message: "Demo simulation only. Deriv API not connected."
      });
    }

    if (url.pathname === "/api/demo/trade" && request.method === "POST") {
      if ((env.TRADING_MODE || "DEMO") !== "DEMO") {
        return json({ error: "Demo mode is not enabled." }, 403);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Send a valid JSON request." }, 400);
      }

      const stake = Number(env.DEMO_STAKE || 1);
      if (!Number.isFinite(stake) || stake <= 0) {
        return json({ error: "Invalid demo stake configuration." }, 400);
      }

      const market = String(body.market || "Volatility 100 Index")
        .slice(0, 80);

      // Illustrative result only; not based on market prices.
      const won = Math.random() >= 0.5;
      const profit = won ? Number((stake * 0.8).toFixed(2)) : -stake;

      return json({
        mode: "DEMO",
        simulated: true,
        market,
        stake,
        result: won ? "WIN" : "LOSS",
        profit,
        message: "Simulated result only. No real trade was placed."
      });
    }

    if (url.pathname.startsWith("/api/")) {
  return json({ error: "API route not matched", path: url.pathname }, 404);
}
return env.ASSETS.fetch(request);

  
