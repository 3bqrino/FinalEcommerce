const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "rejected", "refunded"],
      default: "pending",
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

refundSchema.index({
  order: 1,
  user: 1,
});

refundSchema.index({
  status: 1,
});

module.exports = mongoose.model("Refund", refundSchema);
