export default {
  name: "Vanilla",

  introEmotion: "neutral",

  // Emotion → Bild
  emotions: {
    neutral: "VanillaNeutral.png",
    happy: "VanillaHappy.png",
    sad: "VanillaSad.png",
    angry: "VanillaAngry.png",
    surprised: "VanillaSurprised.png",
    thinking: "VanillaThinking.png",
    shy: "VanillaShy.png",
    flustered: "VanillaFlustered.png",
    downcast: "VanillaDowncast.png",
    meow: "VanillaMeow.png"
  },

  // User Emotion Commands
  emotionCommands: {
    "angry": "angry",
    "sad": "sad",
    "happy": "happy",
    "surprised": "surprised",
    "shy": "shy",
    "neutral": "neutral",
    "meow": "meow",
    "thinking": "thinking",
    "downcast": "downcast",
    "flustered": "flustered"
  },

  // Special Commands
  commands: {
    "meow für mich": "meow",
    "meow for me": "meow"
  },

  shyMeows: [
    "m-meow...",
    "meow... *blushes*",
    "I-I’m not meowing for you… meow…",
    "meow… don’t stare at me like that…",
    "meow… this is embarrassing…"
  ],

  // Micro Emotion Cycle
  microEmotions: {
    neutral: ["neutral"],
    happy: ["happy", "shy"],
    angry: ["angry"],
    sad: ["sad", "downcast"],
    surprised: ["surprised"],
    shy: ["shy", "neutral"],
    thinking: ["thinking", "neutral"]
  }
};
