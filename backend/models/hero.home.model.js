const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    eyebrow: {
      type: String,
      default: "",
    },

    drop: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    accent: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Hero", heroSchema);
