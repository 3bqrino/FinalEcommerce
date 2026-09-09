const Footer = require("../models/footer.home.model");

const catchAsync = require("../utilities/catchAsync.util");

const AppError = require("../utilities/appError.util");

const logger = require("../utilities/logger.util");

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined) {
    return defaultValue;
  }

  return value === true || value === "true";
};

const normalizeLinkArray = (links, fieldName) => {
  if (links === undefined) {
    return undefined;
  }

  if (!Array.isArray(links)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return links
    .filter(
      (item) => item && item.label !== undefined && item.link !== undefined,
    )
    .map((item) => ({
      label: String(item.label).trim(),
      link: String(item.link).trim(),
    }))
    .filter((item) => item.label && item.link);
};

exports.getFooter = catchAsync(async (req, res, next) => {
  const footer = await Footer.findOne({
    isActive: true,
  });

  if (!footer) {
    return next(new AppError("Footer not found", 404));
  }

  res.status(200).json({
    message: "Footer fetched successfully",

    data: {
      footer,
    },
  });
});

exports.updateFooter = catchAsync(async (req, res, next) => {
  let footer = await Footer.findOne();

  const {
    newsletterTitle,
    newsletterDescription,
    newsletterNote,

    brandName,
    brandDescription,

    instagram,
    tiktok,
    twitter,
    youtube,

    shopLinks,
    brandLinks,
    supportLinks,

    shippingBadgeNumber,
    shippingBadgeTitle,
    shippingBadgeText,

    copyrightText,
    rightsText,

    privacyLink,
    privacyLabel,

    termsLink,
    termsLabel,

    isActive,
  } = req.body;

  if (!footer) {
    if (!brandName || !String(brandName).trim()) {
      return next(new AppError("Brand name is required", 400));
    }

    footer = await Footer.create({
      newsletterTitle: newsletterTitle
        ? String(newsletterTitle).trim()
        : "STAY NATURAL.",

      newsletterDescription: newsletterDescription
        ? String(newsletterDescription).trim()
        : "",

      newsletterNote: newsletterNote
        ? String(newsletterNote).trim()
        : "NO SPAM. EVER. UNSUBSCRIBE ANYTIME.",

      brandName: String(brandName).trim(),

      brandDescription: brandDescription ? String(brandDescription).trim() : "",

      instagram: instagram ? String(instagram).trim() : "",

      tiktok: tiktok ? String(tiktok).trim() : "",

      twitter: twitter ? String(twitter).trim() : "",

      youtube: youtube ? String(youtube).trim() : "",

      shopLinks: normalizeLinkArray(shopLinks || [], "shopLinks"),

      brandLinks: normalizeLinkArray(brandLinks || [], "brandLinks"),

      supportLinks: normalizeLinkArray(supportLinks || [], "supportLinks"),

      shippingBadgeNumber: shippingBadgeNumber
        ? String(shippingBadgeNumber).trim()
        : "24",

      shippingBadgeTitle: shippingBadgeTitle
        ? String(shippingBadgeTitle).trim()
        : "FREE",

      shippingBadgeText: shippingBadgeText
        ? String(shippingBadgeText).trim()
        : "SHIPPING ON ORDERS OVER $100",

      copyrightText: copyrightText
        ? String(copyrightText).trim()
        : "© 2026 NATURAL.",

      rightsText: rightsText
        ? String(rightsText).trim()
        : "ALL RIGHTS RESERVED.",

      privacyLink: privacyLink ? String(privacyLink).trim() : "/privacy",

      privacyLabel: privacyLabel
        ? String(privacyLabel).trim()
        : "PRIVACY POLICY",

      termsLink: termsLink ? String(termsLink).trim() : "/terms",

      termsLabel: termsLabel ? String(termsLabel).trim() : "TERMS OF SERVICE",

      isActive: parseBoolean(isActive, true),
    });

    logger.info(`Footer created by admin ${req.user.name}`);

    return res.status(201).json({
      message: "Footer created successfully",

      data: {
        footer,
      },
    });
  }

  if (newsletterTitle !== undefined) {
    if (!String(newsletterTitle).trim()) {
      return next(new AppError("Newsletter title cannot be empty", 400));
    }

    footer.newsletterTitle = String(newsletterTitle).trim();
  }

  if (newsletterDescription !== undefined) {
    footer.newsletterDescription = String(newsletterDescription).trim();
  }

  if (newsletterNote !== undefined) {
    footer.newsletterNote = String(newsletterNote).trim();
  }

  if (brandName !== undefined) {
    if (!String(brandName).trim()) {
      return next(new AppError("Brand name cannot be empty", 400));
    }

    footer.brandName = String(brandName).trim();
  }

  if (brandDescription !== undefined) {
    footer.brandDescription = String(brandDescription).trim();
  }

  if (instagram !== undefined) {
    footer.instagram = String(instagram).trim();
  }

  if (tiktok !== undefined) {
    footer.tiktok = String(tiktok).trim();
  }

  if (twitter !== undefined) {
    footer.twitter = String(twitter).trim();
  }

  if (youtube !== undefined) {
    footer.youtube = String(youtube).trim();
  }

  if (shopLinks !== undefined) {
    try {
      footer.shopLinks = normalizeLinkArray(shopLinks, "shopLinks");
    } catch (error) {
      return next(new AppError(error.message, 400));
    }
  }

  if (brandLinks !== undefined) {
    try {
      footer.brandLinks = normalizeLinkArray(brandLinks, "brandLinks");
    } catch (error) {
      return next(new AppError(error.message, 400));
    }
  }

  if (supportLinks !== undefined) {
    try {
      footer.supportLinks = normalizeLinkArray(supportLinks, "supportLinks");
    } catch (error) {
      return next(new AppError(error.message, 400));
    }
  }

  if (shippingBadgeNumber !== undefined) {
    footer.shippingBadgeNumber = String(shippingBadgeNumber).trim();
  }

  if (shippingBadgeTitle !== undefined) {
    footer.shippingBadgeTitle = String(shippingBadgeTitle).trim();
  }

  if (shippingBadgeText !== undefined) {
    footer.shippingBadgeText = String(shippingBadgeText).trim();
  }

  if (copyrightText !== undefined) {
    footer.copyrightText = String(copyrightText).trim();
  }

  if (rightsText !== undefined) {
    footer.rightsText = String(rightsText).trim();
  }

  if (privacyLink !== undefined) {
    footer.privacyLink = String(privacyLink).trim();
  }

  if (privacyLabel !== undefined) {
    footer.privacyLabel = String(privacyLabel).trim();
  }

  if (termsLink !== undefined) {
    footer.termsLink = String(termsLink).trim();
  }

  if (termsLabel !== undefined) {
    footer.termsLabel = String(termsLabel).trim();
  }

  if (isActive !== undefined) {
    footer.isActive = parseBoolean(isActive);
  }

  await footer.save();

  logger.info(`Footer updated by admin ${req.user.name}`);

  res.status(200).json({
    message: "Footer updated successfully",

    data: {
      footer,
    },
  });
});
