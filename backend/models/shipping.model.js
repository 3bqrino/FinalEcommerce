const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Shipping", shippingSchema);
