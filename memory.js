// =======================================
// MULTI-CHARACTER + MULTI-SESSION MEMORY
// =======================================

// Jede Kombination aus Charakter + Session bekommt eine eigene History
function getMemoryKey(character) {
  const sessionId = localStorage.getItem("sessionId");
  return `memory_${character}_${sessionId}`;
}

// =======================================
// Verlauf abrufen
// =======================================
export function getHistory(character) {
  const key = getMemoryKey(character);
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

// =======================================
// Nachricht hinzufügen
// =======================================
export function addUserMessage(character, text) {
  const key = getMemoryKey(character);
  const history = getHistory(character);
  history.push({ role: "user", content: text });
  saveHistory(key, history);
}

export function addAssistantMessage(character, text) {
  const key = getMemoryKey(character);
  const history = getHistory(character);
  history.push({ role: "assistant", content: text });
  saveHistory(key, history);
}

// =======================================
// Verlauf speichern + begrenzen
// =======================================
function saveHistory(key, history) {
  // Begrenzen auf 20 Nachrichten
  if (history.length > 20) {
    history = history.slice(-20);
  }
  localStorage.setItem(key, JSON.stringify(history));
}

// =======================================
// Verlauf komplett löschen
// =======================================
export function resetMemory(character) {
  const key = getMemoryKey(character);
  localStorage.removeItem(key);
}

