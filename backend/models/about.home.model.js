const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    founderName: { type: String, default: "" },
    founderRole: { type: String, default: "" },
    manifesto: { type: String, default: "" },
    image: { type: String, default: null },
    secondaryImage: { type: String, default: null },
    founderImage: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("About", aboutSchema);
