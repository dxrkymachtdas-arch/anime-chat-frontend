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

  // Emotion Trigger Keywords
  emotionTriggers: {
    shy: [
      "blush", "*blush*", "*blushes*",
      "m-me", "um...", "uhh",
      "embarrassed", "i'm shy",
      "looks away", "stutter",
      "you're teasing me", "don't look at me like that"
    ],

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

    happy: [
      "haha", "hehe", "yay", "lol",
      "good girl", "nice", "well done",
      "thank you", "thanks"
    ],

    sad: [
      "sorry", "forgive me", "i'm sad",
      "i feel bad", "i messed up"
    ],

    angry: [
      "stop", "no!", "not fair",
      "why would you", "hey!", "baka"
    ],

    surprised: [
      "what?!", "eh?!", "really?!",
      "no way", "seriously", "huh?!"
    ],

    thinking: [
      "hmm", "let me think", "thinking",
      "i wonder", "maybe..."
    ],

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

  //  RUHIGE MICRO-EMOTIONS
  microEmotions: {
    neutral: ["neutral", "neutral", "neutral", "shy"], 
    happy: ["happy", "happy", "neutral"],
    angry: ["angry", "neutral"],
    sad: ["sad", "downcast", "neutral"],
    surprised: ["surprised", "neutral"],
    shy: ["shy", "shy", "neutral"], 
    thinking: ["thinking", "neutral"]
  }
};



