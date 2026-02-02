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

  // Emotion Trigger Keywords (NEU – realistisch & anime-like)
  emotionTriggers: {
    shy: [
      "m-me", "blush", "embarrassed", "i'm shy", "looks away",
      "um...", "uhh", "*blushes*", "stutter"
    ],

    flustered: [
      "cute", "pretty", "beautiful", "kiss", "hug", "love",
      "adorable", "sweet", "handsome", "you make me blush",
      "stop teasing me", "baka", "flustered"
    ],

    happy: [
      "haha", "hehe", "yay", "lol", "nice!", "good!", "awesome"
    ],

    sad: [
      "sorry", "forgive me", "i'm sad", "i feel bad"
    ],

    angry: [
      "stop", "no!", "not fair", "why would you", "hey!"
    ],

    surprised: [
      "what?!", "eh?!", "really?!", "no way", "seriously"
    ],

    thinking: [
      "hmm", "let me think", "thinking", "i wonder"
    ],

    meow: [
      "meow", "nya"
    ]
  },

  // User Emotion Commands (manuelle Steuerung)
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

  // Micro Emotion Cycle (NEU – flustered häufiger)
  microEmotions: {
    neutral: ["neutral", "neutral", "flustered"],
    happy: ["happy", "flustered"],
    angry: ["angry"],
    sad: ["sad", "downcast"],
    surprised: ["surprised", "flustered"],
    shy: ["shy", "flustered", "neutral"],
    thinking: ["thinking", "neutral"]
  }
};

