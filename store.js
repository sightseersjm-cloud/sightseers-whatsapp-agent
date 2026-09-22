// Very small in-memory store: per-guest conversation history and captured
// leads. Fine for a single free-tier instance / low volume. Swap for Redis
// or a database if you need persistence across restarts or multiple
// instances — everything that touches storage lives in this one file.

const conversations = new Map(); // waId -> [{role, content}]
const leads = [];

const MAX_TURNS = 20; // keep the last N messages per conversation to bound token usage

function getHistory(waId) {
  return conversations.get(waId) || [];
}

function appendMessage(waId, role, content) {
  const history = conversations.get(waId) || [];
  history.push({ role, content });
  if (history.length > MAX_TURNS) {
    history.splice(0, history.length - MAX_TURNS);
  }
  conversations.set(waId, history);
}

function resetConversation(waId) {
  conversations.delete(waId);
}

function saveLead(waId, lead) {
  const record = { waId, capturedAt: new Date().toISOString(), ...lead };
  leads.push(record);
  return record;
}

function getLeads() {
  return leads;
}

module.exports = {
  getHistory,
  appendMessage,
  resetConversation,
  saveLead,
  getLeads,
};
