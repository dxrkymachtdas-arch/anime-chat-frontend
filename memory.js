// =======================================
// MEMORY SYSTEM (Conversation History)
// =======================================

// Verlauf wird hier gespeichert
let conversationHistory = [];

// =======================================
// Nachricht hinzufügen
// =======================================
export function addUserMessage(text) {
  conversationHistory.push({ role: "user", content: text });
  trimHistory();
}

export function addAssistantMessage(text) {
  conversationHistory.push({ role: "assistant", content: text });
  trimHistory();
}

// =======================================
// Verlauf begrenzen (z. B. 20 Nachrichten)
// =======================================
function trimHistory() {
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }
}

// =======================================
// Verlauf komplett löschen
// =======================================
export function resetMemory() {
  conversationHistory = [];
}

// =======================================
// Verlauf abrufen
// =======================================
export function getHistory() {
  return conversationHistory;
}
