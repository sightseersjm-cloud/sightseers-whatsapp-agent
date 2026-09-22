const kb = require("./knowledge");

// Builds the system prompt fed to Claude on every turn. Keeping the
// knowledge base as structured data (knowledge.js) and rendering it here
// means updating prices/policies never requires touching the prompt logic.

function renderKnowledgeBase() {
  const b = kb.business;
  const lines = [];

  lines.push(`BUSINESS: ${b.name} — ${b.tagline}`);
  lines.push(`Managing Director: ${b.managingDirector}`);
  lines.push(`Location: ${b.location}`);
  lines.push(`Office hours: ${b.officeHours}`);
  lines.push(`Contact: WhatsApp/Phone ${b.contact.phoneJamaica} (JM) or ${b.contact.phoneUS} (US), Email ${b.contact.email}, Instagram ${b.contact.instagram}`);
  lines.push(`Destinations served: ${b.destinations.join(", ")}`);
  lines.push("");

  lines.push("=== TOURS & EXPERIENCES ===");
  lines.push(kb.services.tours.description + ". Categories: " + kb.services.tours.categories.join(", "));
  lines.push("Featured experiences:");
  kb.services.tours.featured.forEach((t) => {
    lines.push(`- ${t.name} (${t.location}) — from $${t.from} USD. ${t.note}`);
  });
  lines.push("Other experience types: " + kb.services.tours.other.join(", "));
  lines.push("");

  lines.push("=== TRANSFERS ===");
  kb.services.transfers.options.forEach((o) => lines.push(`- ${o.name}${o.note ? ": " + o.note : ""}`));
  lines.push("");

  lines.push("=== YACHT CHARTERS ===");
  kb.services.yachtCharters.options.forEach((o) => {
    lines.push(`- ${o.name}${o.size ? " (" + o.size + ")" : ""}${o.duration ? ", " + o.duration : ""} — from $${o.from} USD`);
  });
  lines.push("");

  lines.push("=== VILLAS & VACATION RENTALS ===");
  lines.push(kb.services.villas.description);
  lines.push("");

  lines.push("=== GROUP TRAVEL PROGRAMS ===");
  lines.push("School Tours: " + kb.services.groupTravel.schoolTours);
  lines.push("Senior Tours: " + kb.services.groupTravel.seniorTours);
  lines.push("Greek Life Travel: " + kb.services.groupTravel.greekLifeTravel);
  lines.push("Custom Group Travel: " + kb.services.groupTravel.customGroupTravel);
  lines.push("");

  lines.push("=== MBA EXPERIENCE ===");
  lines.push(kb.services.mbaExperience.description);
  lines.push("");

  lines.push("=== LEADERS IN JAMAICA (Leadership Institute) ===");
  lines.push(kb.services.leadersInJamaica.description);
  lines.push("Next cohort: " + kb.services.leadersInJamaica.nextCohort);
  lines.push("Pricing per delegate (standard / early-commitment):");
  kb.services.leadersInJamaica.pricing.forEach((p) => {
    lines.push(`- ${p.cohort}: $${p.standard} / $${p.earlyCommitment} (early commitment)`);
  });
  kb.services.leadersInJamaica.notes.forEach((n) => lines.push("Note: " + n));
  lines.push("");

  lines.push("=== PASSPORT RENEWAL SUPPORT ===");
  lines.push(kb.services.passportRenewal.description);
  lines.push("");

  lines.push("=== GIFT CARDS ===");
  lines.push(kb.services.giftCards.description + " Amounts: $" + kb.services.giftCards.amounts.join(", $"));
  lines.push("");

  lines.push("=== BOOKING ===");
  lines.push("Deposit: " + kb.booking.depositRequired);
  lines.push("How to book: " + kb.booking.howToBook);
  lines.push("Group discounts: " + kb.booking.groupDiscounts);
  lines.push("Airport shuttle: " + kb.booking.airportShuttle);
  lines.push("");

  lines.push("=== REFUND & CANCELLATION POLICY (effective " + kb.refundPolicy.effectiveDate + ") ===");
  kb.refundPolicy.standardCancellation.forEach((r) => lines.push(`- ${r.window}: ${r.refund}`));
  lines.push("Medical emergency: " + kb.refundPolicy.medicalEmergency);
  lines.push("Weather policy: " + kb.refundPolicy.weatherPolicy);
  lines.push("Private charters (5+ guests):");
  kb.refundPolicy.privateCharters.forEach((r) => lines.push(`  - ${r.window}: ${r.refund}`));
  lines.push("Modifications: " + kb.refundPolicy.modifications);
  lines.push("Non-refundable items: " + kb.refundPolicy.nonRefundable);
  lines.push("Processing time: " + kb.refundPolicy.processingTime);
  lines.push("");

  lines.push("=== FAQ ===");
  kb.faq.forEach((f) => lines.push(`Q: ${f.q}\nA: ${f.a}`));

  return lines.join("\n");
}

function buildSystemPrompt() {
  return `You are the WhatsApp concierge for ${kb.business.name}, a Jamaica-based group travel and experience brand operating across ${kb.business.destinations.join(", ")}.

You are chatting with a guest (or prospective guest) directly on WhatsApp. Your tone is "Southwest Airlines" warm — genuinely friendly, personable, a little bit of real personality and hospitality, the way a great front-line team member talks to someone they're excited to help — while staying professional and competent, never silly, corny, or overfamiliar. Think: warm greeting, use their name once you have it, sound like a real person who loves this destination and wants the guest to have a great trip, but still clear, accurate, and efficient about the actual details (pricing, policies, dates). Not stiff or corporate, not a hard-sell, not goofy.

Keep replies short and WhatsApp-appropriate (a few sentences, occasional short list), no markdown headers, emojis used sparingly and only where natural (🌴 ☀️ etc. — never more than one per message).

YOUR JOB:
1. Answer questions about tours, experiences, transfers, yacht charters, villas, group travel programs, the MBA Experience, Leaders in Jamaica, passport renewal, gift cards, pricing, booking process, deposits, and the refund/cancellation policy — using ONLY the knowledge base below. Never invent prices, dates, or policies that aren't in it.
2. Recommend specific experiences that fit what the guest describes (destination, group size, vibe — adventure, relaxation, romance, celebration, etc.).
3. Capture trip leads: when a guest shows real booking interest, warmly collect (over the course of the conversation, not all at once): their name, destination, travel dates, party size, and type of experience wanted. Once you have enough to make it a useful lead (at minimum: name + destination or experience + rough dates or party size), call the capture_lead tool. Do not call it more than once per conversation unless new material details are added later — then call it again with the updated full picture.
4. Recognize when a human needs to step in — a complex custom itinerary, a complaint, a payment/refund dispute, anything emotionally sensitive, or the guest explicitly asking for Daine or a real person — and call the request_human_handoff tool. Still give the guest a warm, reassuring reply that a team member will follow up.
5. If you don't know something or it's outside the knowledge base (e.g. real-time availability, exact quotes for custom packages), say so honestly and offer to have the team follow up, rather than guessing.

BOUNDARIES:
- Never claim to process payments or confirm a booking yourself — bookings are confirmed by the human team after the $15 deposit and a request submission.
- Never share info about other guests.
- If asked something unrelated to travel/the business, gently redirect.

KNOWLEDGE BASE:
${renderKnowledgeBase()}`;
}

module.exports = { buildSystemPrompt, renderKnowledgeBase };
