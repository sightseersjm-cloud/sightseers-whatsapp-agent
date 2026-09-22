require("dotenv").config();
const express = require("express");
const { sendText, markRead } = require("./src/whatsapp");
const agent = require("./src/agent");
const store = require("./src/store");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Simple health check — also what you can point Render's free-tier
// keep-alive pings at.
app.get("/", (req, res) => {
  res.send("Sight Seers WhatsApp agent is running.");
});

// --- Meta webhook verification (one-time, when you set the webhook URL) ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[webhook] Verified successfully.");
    return res.status(200).send(challenge);
  }
  console.warn("[webhook] Verification failed.");
  return res.sendStatus(403);
});

// --- Incoming messages from guests ---
app.post("/webhook", async (req, res) => {
  // Respond immediately; WhatsApp expects a fast 200 and will retry on
  // timeouts, which could otherwise cause duplicate replies.
  res.sendStatus(200);

  try {
    const entry = req.body.entry && req.body.entry[0];
    const change = entry && entry.changes && entry.changes[0];
    const value = change && change.value;
    const messages = value && value.messages;

    if (!messages || messages.length === 0) {
      return; // status updates (sent/delivered/read) or other webhook events
    }

    for (const message of messages) {
      const waId = message.from; // guest's WhatsApp ID (phone number, no +)
      markRead(message.id);

      let text = null;
      if (message.type === "text") {
        text = message.text.body;
      } else if (message.type === "interactive") {
        text =
          message.interactive?.button_reply?.title ||
          message.interactive?.list_reply?.title ||
          null;
      } else {
        // Unsupported message type (image, audio, location, etc.)
        await sendText(
          waId,
          "Thanks for sending that! I can chat about tours, pricing and bookings here in text — could you type your question and I'll help right away? 🌴"
        );
        continue;
      }

      if (!text) continue;

      console.log(`[webhook] ${waId}: ${text}`);
      const replyText = await agent.reply(waId, text);
      await sendText(waId, replyText);
    }
  } catch (err) {
    console.error("[webhook] Error handling incoming message:", err);
  }
});

// Small local endpoint to inspect captured leads while testing/running.
// Protect or remove this in production if the server is publicly reachable
// beyond the webhook.
app.get("/leads", (req, res) => {
  res.json(store.getLeads());
});

app.listen(PORT, () => {
  console.log(`Sight Seers WhatsApp agent listening on port ${PORT}`);
});
