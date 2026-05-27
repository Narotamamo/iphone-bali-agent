export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key, anthropic-version",
    };
    if (request.method === "OPTIONS")
      return new Response(null, { headers: cors });
    try {
      const body = await request.json();
      const apiKey = request.headers.get("x-api-key");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: err.message } }), {
        status: 500, headers: { ...cors, "Content-Type": "application/json" }
      });
    }
  }
};
