const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  age: {
    type: Number,
    required: true,
    min: 13,
    max: 100,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  occupation: {
    type: String,
    enum: ["student", "working", "seeking"],
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  isOnboarded: {
    type: Boolean,
    default: false,
  },

  onboardingAnswers: {
    interests: {
      type: [String],
      default: [],
    },

    skillLevel: {
      type: String,
      default: "",
    },

    preferredDomain: {
      type: String,
      default: "",
    },

  },

  githubUsername: {
    type: String,
    default: "",
  },

  githubScore: {
    type: Number,
    default: 0,
  },

  githubAnalysis: {
    followers: {
      type: Number,
      default: 0,
    },

    following: {
      type: Number,
      default: 0,
    },

    repositories: {
      type: Number,
      default: 0,
    },

    totalStars: {
      type: Number,
      default: 0,
    },

    totalForks: {
      type: Number,
      default: 0,
    },

    mostUsedLanguage: {
      type: String,
      default: "",
    },

    languageDistribution: {
      type: Object,
      default: {},
    },

    topRepositories: {
      type: Array,
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    lastGithubAnalysis: {
      type: Date,
      default: null,
    },
  },

  resumeScore: {
    type: Number,
    default: 0,
  },

  predictedRole: {
    type: String,
    default: "",
  },

  lastResumeAnalysis: {
    type: Date,
    default: null,
  },

  portfolioScore: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);