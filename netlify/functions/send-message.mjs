export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, username, message, email } = data;

  let text;
  if (type === "about") {
    if (!username || !message) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    text = `📨 New message — monster-az.netlify.app\n👤 From: ${username}\n💬 Message: ${message}`;
  } else if (type === "subscribe") {
    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }
    text = `🔔 New subscriber — monster-az.netlify.app\n📧 ${email}`;
  } else {
    return Response.json({ error: "Unknown type" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    if (!res.ok) throw new Error("telegram-failed");
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: "Telegram send failed" }, { status: 502 });
  }
};

export const config = {
  path: "/api/send-message",
  method: "POST",
};