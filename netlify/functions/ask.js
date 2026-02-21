export default async function(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: { message: "Method not allowed" } }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: "API key not configured" } }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    var body = await req.json();

    var res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-5-20250929",
        max_tokens: body.max_tokens || 1024,
        system: body.system || "",
        messages: body.messages || [],
        stream: true
      })
    });

    if (!res.ok) {
      var errText = await res.text();
      return new Response(errText, {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: "Function error: " + err.message } }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export var config = {
  path: "/.netlify/functions/ask"
};
