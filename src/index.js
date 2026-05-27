export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key, anthropic-version",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify({ status: "iPhone Bali Proxy OK" }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: { message: "Method not allowed" } }), {
        status: 405,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === "") {
        return new Response(JSON.stringify({ error: { message: "Request body kosong" } }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" }
        });
      }
      body = JSON.parse(text);
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: "JSON tidak valid: " + err.message } }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || !apiKey.startsWith("sk-ant-")) {
      return new Response(JSON.stringify({ error: { message: "API key tidak valid" } }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    try {
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
      return new Response(JSON.stringify({ error: { message: "Gagal koneksi ke Anthropic: " + err.message } }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }
  }
};
