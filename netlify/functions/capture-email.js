// PMM rationale: This serverless function captures email leads from the content gate.
// In production, this would forward to a CRM (HubSpot, Salesforce) or email platform
// (Mailchimp, Customer.io) for nurture sequences. For the portfolio piece, it logs
// the capture to demonstrate the full mechanic end-to-end.

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { email, persona, source, timestamp } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Log the capture — in production, this is where you'd call your CRM API
    console.log("[CreditPulse Email Capture]", JSON.stringify({
      email,
      persona: persona || "unknown",
      source: source || "unknown",
      timestamp: timestamp || new Date().toISOString(),
    }));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Function error: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
