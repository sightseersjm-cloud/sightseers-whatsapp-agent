const Anthropic = require("@anthropic-ai/sdk");
const { buildSystemPrompt } = require("./systemPrompt");
const store = require("./store");
const { notifyOwner } = require("./whatsapp");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

const SYSTEM_PROMPT = buildSystemPrompt();

const tools = [
  {
    name: "capture_lead",
    description:
      "Record a guest's trip interest as a lead for the Sight Seers team to follow up on. Call this once you have enough useful detail (name plus at least destination/experience or dates/party size). Call again later in the same conversation if significant new details emerge.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Guest's name, if given" },
        destination: { type: "string", description: "Destination(s) of interest" },
        experienceType: { type: "string", description: "Type of experience/tour/service they want" },
        travelDates: { type: "string", description: "Travel dates or timeframe, as stated" },
        partySize: { type: "string", description: "Number of travelers / group size" },
        budget: { type: "string", description: "Budget range, if mentioned" },
        notes: { type: "string", description: "Any other relevant detail from the conversation" },
      },
      required: [],
    },
  },
  {
    name: "request_human_handoff",
    description:
      "Flag this conversation for a human team member (Daine) to personally follow up — for complaints, refund/payment disputes, complex custom itineraries, sensitive situations, or when the guest explicitly asks for a real person.",
    input_schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Why this needs a human, in a short phrase" },
        summary: { type: "string", description: "Brief summary of the guest's situation/request" },
        urgent: { type: "boolean", description: "True if this needs prompt attention (e.g. a complaint or same-day issue)" },
      },
      required: ["reason", "summary"],
    },
  },
];

async function handleToolUse(waId, toolUse) {
  if (toolUse.name === "capture_lead") {
    const lead = store.saveLead(waId, toolUse.input);
    console.log("[agent] Lead captured:", lead);
    const lines = [
      "🌴 New Sight Seers lead (via WhatsApp bot)",
      `From: ${waId}`,
      lead.name ? `Name: ${lead.name}` : null,
      lead.destination ? `Destination: ${lead.destination}` : null,
      lead.experienceType ? `Experience: ${lead.experienceType}` : null,
      lead.travelDates ? `Dates: ${lead.travelDates}` : null,
      lead.partySize ? `Party size: ${lead.partySize}` : null,
      lead.budget ? `Budget: ${lead.budget}` : null,
      lead.notes ? `Notes: ${lead.notes}` : null,
    ].filter(Boolean);
    await notifyOwner(lines.join("\n"));
    return { status: "lead_captured" };
  }

  if (toolUse.name === "request_human_handoff") {
    console.log("[agent] Human handoff requested:", toolUse.input);
    const lines = [
      toolUse.input.urgent ? "🚨 URGENT — human needed on WhatsApp" : "👋 Human follow-up requested on WhatsApp",
      `From: ${waId}`,
      `Reason: ${toolUse.input.reason}`,
      `Summary: ${toolUse.input.summary}`,
    ];
    await notifyOwner(lines.join("\n"));
    return { status: "handoff_requested" };
  }

  return { status: "unknown_tool" };
}

// Runs one turn: takes the guest's incoming text, updates history, calls
// Claude (looping through any tool calls), and returns the final reply text.
async function reply(waId, incomingText) {
  store.appendMessage(waId, "user", incomingText);

  let messages = store.getHistory(waId).map((m) => ({ role: m.role, content: m.content }));
  let finalText = "";

  // Allow a small number of tool-use round trips per turn.
  for (let i = 0; i < 4; i++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    const textParts = response.content.filter((b) => b.type === "text").map((b) => b.text);
    const toolUses = response.content.filter((b) => b.type === "tool_use");

    if (textParts.length) {
      finalText = textParts.join("\n\n");
    }

    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      break;
    }

    // Append assistant turn (with tool_use blocks) and run each tool.
    messages.push({ role: "assistant", content: response.content });

    const toolResults = [];
    for (const toolUse of toolUses) {
      const result = await handleToolUse(waId, toolUse);
      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      });
    }
    messages.push({ role: "user", content: toolResults });
  }

  if (!finalText) {
    finalText = "Thanks for reaching out! Let me get a member of our team to follow up with you shortly. 🌴";
  }

  store.appendMessage(waId, "assistant", finalText);
  return finalText;
}

module.exports = { reply };
