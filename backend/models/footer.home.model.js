const mongoose = require("mongoose");

const footerLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const footerSchema = new mongoose.Schema(
  {
    newsletterTitle: {
      type: String,
      required: true,
      trim: true,
      default: "STAY NATURAL.",
    },

    newsletterDescription: {
      type: String,
      default: "",
      trim: true,
    },

    newsletterNote: {
      type: String,
      default: "NO SPAM. EVER. UNSUBSCRIBE ANYTIME.",
      trim: true,
    },

    brandName: {
      type: String,
      required: true,
      trim: true,
      default: "NATURAL",
    },

    brandDescription: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    tiktok: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    youtube: {
      type: String,
      default: "",
      trim: true,
    },

    shopLinks: {
      type: [footerLinkSchema],
      default: [],
    },

    brandLinks: {
      type: [footerLinkSchema],
      default: [],
    },

    supportLinks: {
      type: [footerLinkSchema],
      default: [],
    },

    shippingBadgeNumber: {
      type: String,
      default: "24",
      trim: true,
    },

    shippingBadgeTitle: {
      type: String,
      default: "FREE",
      trim: true,
    },

    shippingBadgeText: {
      type: String,
      default: "SHIPPING ON ORDERS OVER $100",
      trim: true,
    },

    copyrightText: {
      type: String,
      default: "© 2026 NATURAL.",
      trim: true,
    },

    rightsText: {
      type: String,
      default: "ALL RIGHTS RESERVED.",
      trim: true,
    },

    privacyLink: {
      type: String,
      default: "/privacy",
      trim: true,
    },

    privacyLabel: {
      type: String,
      default: "PRIVACY POLICY",
      trim: true,
    },

    termsLink: {
      type: String,
      default: "/terms",
      trim: true,
    },

    termsLabel: {
      type: String,
      default: "TERMS OF SERVICE",
      trim: true,
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

module.exports = mongoose.model("Footer", footerSchema);
