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

  // Emotion Trigger Keywords (NEU – balanced)
  emotionTriggers: {
    // SHY = Hauptreaktion bei Blush
    shy: [
      "blush", "*blush*", "*blushes*",
      "m-me", "um...", "uhh",
      "embarrassed", "i'm shy",
      "looks away", "stutter"
    ],

    angry: [
      "baka"
    ],
    
    happy: ["haha", "hehe", "yay", "lol"],
    sad: ["sorry", "forgive me", "i'm sad"],
    angry: ["stop", "no!", "not fair"],
    surprised: ["what?!", "eh?!", "really?!"],
    thinking: ["hmm", "let me think", "thinking"],
    meow: ["meow", "nya"]
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
    "meow": "meow",
    "meow for me": "meow",
    "show me your emotions": "showEmotions"
  },

  shyMeows: [
    "m-meow...",
    "meow... *blushes*",
    "I-I’m not meowing for you… meow…",
    "meow… don’t stare at me like that…",
    "meow… this is embarrassing…"
  ],

  // Micro Emotion Cycle (NEU – flustered SELTEN)
  microEmotions: {
    neutral: ["neutral", "neutral", "shy"], // shy häufiger als flustered
    happy: ["happy", "shy"],
    angry: ["angry"],
    sad: ["sad", "downcast"],
    surprised: ["surprised", "shy"],
    shy: ["shy", "neutral"], // shy bleibt shy
    thinking: ["thinking", "neutral"]
  }
};




