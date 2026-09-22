// Thin wrapper around the Meta WhatsApp Cloud API (Graph API).
const fetch = global.fetch || require("node-fetch");

const GRAPH_VERSION = "v21.0";

function apiUrl(path) {
  return `https://graph.facebook.com/${GRAPH_VERSION}/${path}`;
}

async function sendText(toWaId, body) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    console.error("[whatsapp] Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN env vars.");
    return;
  }

  const res = await fetch(apiUrl(`${phoneNumberId}/messages`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toWaId,
      type: "text",
      text: { body, preview_url: false },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[whatsapp] send failed (${res.status}):`, errText);
  }

  return res;
}

async function markRead(messageId) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !token) return;

  await fetch(apiUrl(`${phoneNumberId}/messages`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  }).catch((err) => console.error("[whatsapp] markRead failed:", err.message));
}

// Notify the business owner (Daine) on WhatsApp — used for new leads and
// human-handoff requests. Set OWNER_WHATSAPP_NUMBER in .env to enable.
async function notifyOwner(message) {
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;
  if (!ownerNumber) {
    console.log("[whatsapp] OWNER_WHATSAPP_NUMBER not set — skipping owner notification:\n", message);
    return;
  }
  return sendText(ownerNumber, message);
}

module.exports = { sendText, markRead, notifyOwner };
