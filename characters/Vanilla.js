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
    flustered: "VanillaFlustered.png", // ShyMeow
    downcast: "VanillaDowncast.png",
    meow: "VanillaMeow.png"
  },

  // Emotion Trigger Keywords (Nekopara-like)
  emotionTriggers: {
    // SHY = Vanilla’s typische Reaktion bei Blush
    shy: [
      "blush", "*blush*", "*blushes*",
      "m-me", "um...", "uhh",
      "embarrassed", "i'm shy",
      "looks away", "stutter",
      "you're teasing me", "don't look at me like that"
    ],

    // FLUSTERED = SHY + MEOW (ShyMeow)
    flustered: [
      "m-meow",
      "meow... *blushes*",
      "nya... *blush*",
      "shy meow",
      "meow shy",
      "meow while blushing",
      "meow and blush",
      "nya while blushing"
    ],

    // HAPPY = Vanilla’s soft smile
    happy: [
      "haha", "hehe", "yay", "lol",
      "good girl", "nice", "well done",
      "thank you", "thanks"
    ],

    // SAD / DOWNCAST
    sad: [
      "sorry", "forgive me", "i'm sad",
      "i feel bad", "i messed up"
    ],

    // ANGRY = Vanilla’s tsun side (leicht genervt)
    angry: [
      "stop", "no!", "not fair",
      "why would you", "hey!", "baka"
    ],

    // SURPRISED = typische Vanilla-Reaktion
    surprised: [
      "what?!", "eh?!", "really?!",
      "no way", "seriously", "huh?!"
    ],

    // THINKING
    thinking: [
      "hmm", "let me think", "thinking",
      "i wonder", "maybe..."
    ],

    // MEOW
    meow: [
      "meow", "nya", "nyan", "nyaa"
    ]
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

  // Micro Emotion Cycle
  microEmotions: {
    neutral: ["neutral", "neutral", "shy"],
    happy: ["happy", "shy"],
    angry: ["angry"],
    sad: ["sad", "downcast"],
    surprised: ["surprised", "shy"],
    shy: ["shy", "neutral", "flustered"], // flustered nur hier möglich
    thinking: ["thinking", "neutral"]
  }
};


