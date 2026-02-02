// =======================================
// SESSION ID (unique per device)
// =======================================
let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);
}

// =======================================
// MEMORY IMPORT
// =======================================
import {
  addUserMessage,
  addAssistantMessage,
  getHistory,
  resetMemory
} from "./memory.js";

// =======================================
// CHARACTER IMPORTS
// =======================================
import Vanilla from "./characters/Vanilla.js";

const characters = { Vanilla };
let selectedCharacter = null;
let activeCharacter = null;

// =======================================
// DOM ELEMENTS
// =======================================
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const avatarEl = document.getElementById("avatar");
const typingIndicator = document.getElementById("typing-indicator");

// =======================================
// AUDIO UNLOCK
// =======================================
let audioEnabled = false;
window.addEventListener("click", () => {
  audioEnabled = true;
});

// =======================================
// SETTINGS
// =======================================
const settings = {
  soundEnabled: true,
  soundVolume: 0.8,
  soundPitch: true,
  textSpeed: 22,
  emotionEnabled: true,
  crtEnabled: true
};

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem("chatSettings"));
  if (saved) Object.assign(settings, saved);

  document.getElementById("soundEnabled").checked = settings.soundEnabled;
  document.getElementById("soundVolume").value = settings.soundVolume;
  document.getElementById("soundPitch").checked = settings.soundPitch;
  document.getElementById("textSpeed").value = settings.textSpeed;
  document.getElementById("emotionEnabled").checked = settings.emotionEnabled;
  document.getElementById("crtEnabled").checked = settings.crtEnabled;

  applySettings();
}

function saveSettings() {
  localStorage.setItem("chatSettings", JSON.stringify(settings));
}

function applySettings() {
  if (window.typeSounds) {
    window.typeSounds.forEach(s => s.volume = settings.soundVolume);
  }
  document.body.classList.toggle("crt-off", !settings.crtEnabled);
}

function initSettings() {
  loadSettings();

  const overlay = document.getElementById("settingsOverlay");
  const btn = document.getElementById("settingsButton");
  const close = document.getElementById("closeSettings");

  btn.onclick = () => overlay.classList.remove("hidden");
  close.onclick = () => overlay.classList.add("hidden");

  document.querySelectorAll("#settingsOverlay input").forEach(input => {
    input.addEventListener("input", () => {
      const id = input.id;
      const value = input.type === "checkbox" ? input.checked : parseFloat(input.value);
      settings[id] = value;
      saveSettings();
      applySettings();
    });
  });
}

initSettings();

// =======================================
// CHARACTER SELECT
// =======================================
function initCharacterSelect() {
  const cards = document.querySelectorAll(".character-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      selectedCharacter = card.dataset.character;
      activeCharacter = characters[selectedCharacter];
      localStorage.setItem("selectedCharacter", selectedCharacter);

      document.getElementById("character-select").classList.add("hidden");
      document.getElementById("chat-app").classList.remove("hidden");

      setEmotion(activeCharacter.introEmotion || "neutral");
    });
  });
}

initCharacterSelect();

// =======================================
// BOOT SCREEN
// =======================================
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("boot-screen").style.display = "none";
    document.getElementById("character-select").classList.remove("hidden");
  }, 2000);
});

// =======================================
// EMOTION → IMAGE
// =======================================
function getEmotionImage(character, emotion) {
  return `images/${character}${capitalize(emotion)}.png`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setEmotion(emotion) {
  if (!settings.emotionEnabled || !selectedCharacter) {
    avatarEl.src = "images/VanillaNeutral.png";
    return;
  }
  avatarEl.src = getEmotionImage(selectedCharacter, emotion);
}

// =======================================
// SOUNDS
// =======================================
window.typeSounds = [
  new Audio("sounds/type1.mp3"),
  new Audio("sounds/type2.mp3"),
];

window.typeSounds.forEach(s => {
  s.volume = settings.soundVolume;
  s.preload = "auto";
});

// =======================================
// EMOTION CONTROL
// =======================================
let isThinking = false;
let isExplaining = false;

// =======================================
// PLAY TYPE SOUND
// =======================================
function playTypeSound() {
  if (!audioEnabled || !settings.soundEnabled) return;

  const sound = window.typeSounds[Math.floor(Math.random() * window.typeSounds.length)];
  sound.currentTime = 0;

  sound.playbackRate = settings.soundPitch
    ? 0.9 + Math.random() * 0.2
    : 1;

  sound.play().catch(() => {});
}

// =======================================
// USER EMOTION COMMANDS
// =======================================
function detectUserEmotionCommand(text) {
  if (!activeCharacter) return null;

  const t = text.toLowerCase();
  for (const key in activeCharacter.emotionCommands) {
    if (t.includes(key)) return activeCharacter.emotionCommands[key];
  }
  return null;
}

// =======================================
// EXPLAIN DETECTION
// =======================================
function detectExplainCommand(text) {
  const t = text.toLowerCase().trim();
  const triggers = [
    "explain", "explain that", "explain this", "explain it", "explain again",
    "explain pls", "explain please", "can you explain", "could you explain",
    "please explain", "help me understand", "i don't understand this",
    "i dont understand this", "why does this work", "how does this work",
    "explain the topic", "explain that topic", "explain this topic"
  ];
  return triggers.some(p => t.includes(p));
}

// =======================================
// DETECT AVATAR EMOTION (CHARACTER-BASED + SHYMEOW)
// =======================================
function detectAvatarEmotion(text, char) {
  if (!activeCharacter) return null;

  const t = text.toLowerCase();

  // 1. Surprise by punctuation
  if (char === "!") return "surprised";

  // 2. Check all triggers from character file
  if (activeCharacter.emotionTriggers) {
    for (const emotion in activeCharacter.emotionTriggers) {
      const triggers = activeCharacter.emotionTriggers[emotion];
      for (const trigger of triggers) {
        if (t.includes(trigger)) return emotion;
      }
    }
  }

  // 3. Special case: Shy + Meow = Flustered (ShyMeow)
  if (
    activeCharacter.emotionTriggers &&
    activeCharacter.emotionTriggers.shy &&
    activeCharacter.emotionTriggers.meow
  ) {
    const shyHit = activeCharacter.emotionTriggers.shy.some(k => t.includes(k));
    const meowHit = activeCharacter.emotionTriggers.meow.some(k => t.includes(k));
    if (shyHit && meowHit) return "flustered";
  }

  // 4. Default: no strong emotion
  return null;
}

// =======================================
// CALM MICRO-EMOTIONS
// =======================================
function calmEmotionCycle(baseEmotion) {
  if (!activeCharacter) return baseEmotion;

  const list = activeCharacter.microEmotions[baseEmotion] || ["neutral"];
  return list[Math.floor(Math.random() * list.length)];
}

// =======================================
// EMOTION COOLDOWN
// =======================================
let lastEmotionChange = 0;
const EMOTION_COOLDOWN = 900; // ms

// =======================================
// TYPEWRITER EFFECT
// =======================================
async function typeWriter(element, text, finalEmotion) {
  const actualSpeed = 100 - settings.textSpeed;
  let lastEmotion = "neutral";
  let lastSwitch = Date.now();

  if (!isExplaining) setEmotion("surprised");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    element.textContent += char;

    const emo = detectAvatarEmotion(text, char);
    const now = Date.now();

    if (emo && emo !== lastEmotion && !isExplaining) {
      if (now - lastEmotionChange > EMOTION_COOLDOWN) {
        setEmotion(emo);
        lastEmotion = emo;
        lastEmotionChange = now;
        lastSwitch = now;
      }
    }

    if (isExplaining) {
      const nowExplain = Date.now();
      if (nowExplain - lastSwitch > 1500 + Math.random() * 1500) {
        const next = avatarEl.src.includes("Thinking") ? "surprised" : "thinking";
        setEmotion(next);
        lastSwitch = nowExplain;
      }
    }

    if (!isExplaining && !isThinking) {
      const nowCalm = Date.now();
      if (nowCalm - lastSwitch > 1200 + Math.random() * 800) {
        const next = calmEmotionCycle(lastEmotion);
        setEmotion(next);
        lastSwitch = nowCalm;
      }
    }

    playTypeSound();
    messagesEl.scrollTop = messagesEl.scrollHeight;
    await new Promise(res => setTimeout(res, actualSpeed));
  }

  setTimeout(() => {
    isThinking = false;
    isExplaining = false;
    setEmotion(finalEmotion || lastEmotion || "neutral");
  }, 1200);
}

// =======================================
// TYPING INDICATOR
// =======================================
function showTyping() {
  typingIndicator.style.display = "block";
}

function hideTyping() {
  typingIndicator.style.display = "none";
}

// =======================================
// MESSAGE ELEMENT
// =======================================
function createMessageElement(from) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg ${from}`;

  const speaker = from === "ai"
    ? (selectedCharacter || "Vanilla")
    : "ME";

  const nameEl = document.createElement("div");
  nameEl.className = "msg-name";
  nameEl.textContent = speaker + ":";

  const textEl = document.createElement("div");
  textEl.className = "msg-text";

  wrapper.appendChild(nameEl);
  wrapper.appendChild(textEl);

  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  return textEl;
}

// =======================================
// SEND MESSAGE (WITH SESSION + CHARACTER MEMORY)
// =======================================
async function sendMessage() {
  const msg = inputEl.value.trim();
  if (!msg) return;

  const userEl = createMessageElement("user");
  userEl.textContent = msg;

  // Multi-character memory
  addUserMessage(selectedCharacter, msg);
  inputEl.value = "";

  const userEmotion = detectUserEmotionCommand(msg);
  if (userEmotion) setEmotion(userEmotion);

  // MEMORY RESET COMMAND
  if (
    msg.toLowerCase().includes("reset memory") ||
    msg.toLowerCase().includes("wipe memory") ||
    msg.toLowerCase().includes("forget everything")
  ) {
    resetMemory(selectedCharacter);

    const aiEl = createMessageElement("ai");
    const line = "My memory has been reset.";
    addAssistantMessage(selectedCharacter, line);
    await typeWriter(aiEl, line, "neutral");
    return;
  }

  // EXPLAIN MODE
  if (detectExplainCommand(msg)) {
    isThinking = true;
    isExplaining = true;
    setEmotion("thinking");
  }

  // CHARACTER COMMANDS
  for (const key in activeCharacter.commands) {
    if (msg.toLowerCase().includes(key)) {

      const emotion = activeCharacter.commands[key];

      // shy meow
      if (emotion === "meow" && avatarEl.src.includes("Shy")) {
        const line = activeCharacter.shyMeows[
          Math.floor(Math.random() * activeCharacter.shyMeows.length)
        ];
        addAssistantMessage(selectedCharacter, line);
        const aiEl = createMessageElement("ai");
        setEmotion("meow");
        await typeWriter(aiEl, line, "shy");
        return;
      }

      // normal command
      addAssistantMessage(selectedCharacter, emotion);
      const aiEl = createMessageElement("ai");
      setEmotion(emotion);
      await typeWriter(aiEl, emotion, "neutral");
      return;
    }
  }

  showTyping();

  // =======================================
  // FETCH WITH SESSION + CHARACTER HISTORY
  // =======================================
  const response = await fetch("https://anime-chat-backend.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      history: getHistory(selectedCharacter),
      character: selectedCharacter || "Vanilla",
      sessionId: sessionId
    })
  });

  const data = await response.json();

  addAssistantMessage(selectedCharacter, data.reply);

  hideTyping();

  const aiEl = createMessageElement("ai");
  await typeWriter(aiEl, data.reply, data.emotion || "neutral");
}

// =======================================
// EVENT LISTENERS
// =======================================
sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

inputEl.focus();

console.log("animeChat.js fully loaded with modular character system + multi-character sessions.");





