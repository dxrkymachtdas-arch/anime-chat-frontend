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
// USER EMOTION COMMANDS (MODULAR)
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
// DETECT STRONG EMOTIONS
// =======================================
function detectAvatarEmotion(text, char) {
  const t = text.toLowerCase();
  if (char === "!") return "surprised";
  if (t.includes("haha") || t.includes("lol")) return "happy";
  if (t.includes("sorry") || t.includes("i am sorry")) return "sad";
  if (t.includes("no") || t.includes("not") || t.includes("stop")) return "angry";
  return null;
}

// =======================================
// CALM MICRO-EMOTIONS (MODULAR)
// =======================================
function calmEmotionCycle(baseEmotion) {
  if (!activeCharacter) return baseEmotion;

  const list = activeCharacter.microEmotions[baseEmotion] || ["neutral"];
  return list[Math.floor(Math.random() * list.length)];
}

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
    if (emo && emo !== lastEmotion && !isExplaining) {
      setEmotion(emo);
      lastEmotion = emo;
      lastSwitch = Date.now();
    }

    if (isExplaining) {
      const now = Date.now();
      if (now - lastSwitch > 1500 + Math.random() * 1500) {
        const next = avatarEl.src.includes("Thinking") ? "surprised" : "thinking";
        setEmotion(next);
        lastSwitch = now;
      }
    }

    if (!isExplaining && !isThinking) {
      const now = Date.now();
      if (now - lastSwitch > 350 + Math.random() * 450) {
        setEmotion(calmEmotionCycle(lastEmotion));
        lastSwitch = now;
      }
    }

    playTypeSound();
    messagesEl.scrollTop = messagesEl.scrollHeight;
    await new Promise(res => setTimeout(res, actualSpeed));
  }

  setTimeout(() => {
    isThinking = false;
    isExplaining = false;
    setEmotion("neutral");
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
// SEND MESSAGE
// =======================================
async function sendMessage() {
  const msg = inputEl.value.trim();
  if (!msg) return;

  const userEl = createMessageElement("user");
  userEl.textContent = msg;

  addUserMessage(msg);
  inputEl.value = "";

  const userEmotion = detectUserEmotionCommand(msg);
  if (userEmotion) setEmotion(userEmotion);

  // MEMORY RESET COMMAND
  if (
    msg.toLowerCase().includes("reset memory") ||
    msg.toLowerCase().includes("wipe memory") ||
    msg.toLowerCase().includes("forget everything")
  ) {
    resetMemory();

    const aiEl = createMessageElement("ai");
    const line = "My memory has been reset.";
    addAssistantMessage(line);
    await typeWriter(aiEl, line, "neutral");
    return;
  }

  // EXPLAIN MODE
  if (detectExplainCommand(msg)) {
    isThinking = true;
    isExplaining = true;
    setEmotion("thinking");
  }

  // CHARACTER COMMANDS (MODULAR)
  for (const key in activeCharacter.commands) {
    if (msg.toLowerCase().includes(key)) {

      const emotion = activeCharacter.commands[key];

      // shy meow
      if (emotion === "meow" && avatarEl.src.includes("Shy")) {
        const line = activeCharacter.shyMeows[
          Math.floor(Math.random() * activeCharacter.shyMeows.length)
        ];
        addAssistantMessage(line);
        const aiEl = createMessageElement("ai");
        setEmotion("meow");
        await typeWriter(aiEl, line, "shy");
        return;
      }

      // normal command
      addAssistantMessage(emotion);
      const aiEl = createMessageElement("ai");
      setEmotion(emotion);
      await typeWriter(aiEl, emotion, "neutral");
      return;
    }
  }

  showTyping();

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      history: getHistory(),
      character: selectedCharacter || "Vanilla"
    })
  });

  const data = await response.json();

  addAssistantMessage(data.reply);

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

console.log("animeChat.js fully loaded with modular character system.");

