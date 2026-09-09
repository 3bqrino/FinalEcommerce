const mongoose = require("mongoose");

const promoBannerSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    discount: { type: Number, default: null, min: 0 },
    link: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PromoBanner", promoBannerSchema);
