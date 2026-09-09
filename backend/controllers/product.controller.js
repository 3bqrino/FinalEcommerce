const Product = require("../models/product.model");
const Category = require("../models/category.model");
const SubCategory = require("../models/sub-category.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined) {
    return defaultValue;
  }

  return value === true || value === "true";
};

const populateProduct = (query) => {
  return query
    .populate("category", "name slug")
    .populate("subCategory", "name slug");
};

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    price,
    slug,
    stock,
    category,
    subCategory,
    rating,
    isActive,
    isNewArrival,
    isTopSeller,
  } = req.body;

  if (
    !name ||
    !description ||
    price === undefined ||
    !slug ||
    stock === undefined ||
    !category ||
    !subCategory
  ) {
    return next(
      new AppError(
        "Name, description, price, slug, stock, category and subCategory are required",
        400,
      ),
    );
  }

  if (!req.file) {
    return next(new AppError("Product image is required", 400));
  }

  const normalizedSlug = slug.trim().toLowerCase();

  const existingProduct = await Product.findOne({
    slug: normalizedSlug,
    isDeleted: false,
  });

  if (existingProduct) {
    return next(new AppError("Product slug already exists", 409));
  }

  const myCategory = await Category.findOne({
    _id: category,
    isDeleted: false,
  });

  if (!myCategory) {
    return next(new AppError("Category not found", 404));
  }

  const mySubCategory = await SubCategory.findOne({
    _id: subCategory,
    isDeleted: false,
  });

  if (!mySubCategory) {
    return next(new AppError("Subcategory not found", 404));
  }

  if (mySubCategory.category.toString() !== category.toString()) {
    return next(
      new AppError("Subcategory does not belong to this category", 400),
    );
  }

  const product = await Product.create({
    name: name.trim(),

    description: description.trim(),

    price: Number(price),

    slug: normalizedSlug,

    stock: Number(stock),

    category,

    subCategory,

    rating: rating === undefined ? 0 : Number(rating),

    isActive: parseBoolean(isActive, true),

    isNewArrival: parseBoolean(isNewArrival, false),

    isTopSeller: parseBoolean(isTopSeller, false),

    image: req.file.filename,
  });

  const populatedProduct = await populateProduct(Product.findById(product._id));

  logger.info(`Product created: ${product.name} by admin ${req.user.name}`);

  res.status(201).json({
    message: "Product created successfully",

    data: {
      product: populatedProduct,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const paginated = res.paginatedResult;

  const products = paginated
    ? await Product.populate(paginated.results, [
        {
          path: "category",
          select: "name slug",
        },
        {
          path: "subCategory",
          select: "name slug",
        },
      ])
    : await populateProduct(
        Product.find({
          isDeleted: false,
          isActive: true,
        }).sort({
          createdAt: -1,
        }),
      );

  res.status(200).json({
    message: "Products fetched successfully",

    data: {
      products,

      pagination: paginated
        ? {
            page: paginated.page,

            limit: paginated.limit,

            totalPages: paginated.totalPages,

            total: paginated.total,
          }
        : undefined,
    },
  });
});

exports.getAllProductsForAdmin = catchAsync(async (req, res) => {
  const paginated = res.paginatedResult;

  const products = await Product.populate(paginated.results, [
    {
      path: "category",
      select: "name slug",
    },
    {
      path: "subCategory",
      select: "name slug",
    },
  ]);

  res.status(200).json({
    message: "Products fetched successfully",
    data: {
      products,
      pagination: {
        page: paginated.page,
        limit: paginated.limit,
        totalPages: paginated.totalPages,
        total: paginated.total,
      },
    },
  });
});

exports.getProductBySlug = catchAsync(async (req, res, next) => {
  const product = await populateProduct(
    Product.findOne({
      slug: req.params.slug,

      isDeleted: false,

      isActive: true,
    }),
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    message: "Product fetched successfully",

    data: {
      product,
    },
  });
});

exports.getRelatedProducts = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    slug: req.params.slug,

    isDeleted: false,

    isActive: true,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const products = await populateProduct(
    Product.find({
      category: product.category,

      _id: {
        $ne: product._id,
      },

      isDeleted: false,

      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .limit(4),
  );

  res.status(200).json({
    message: "Related products fetched successfully",

    data: {
      products,
    },
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.slug,

    isDeleted: false,

    isActive: true,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const products = await populateProduct(
    Product.find({
      category: category._id,

      isDeleted: false,

      isActive: true,
    }).sort({
      createdAt: -1,
    }),
  );

  res.status(200).json({
    message: "Category products fetched successfully",

    data: {
      category: {
        _id: category._id,

        name: category.name,

        slug: category.slug,
      },

      products,
    },
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await populateProduct(
    Product.findOne({
      _id: req.params.id,

      isDeleted: false,

      isActive: true,
    }),
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    message: "Product fetched successfully",

    data: {
      product,
    },
  });
});

exports.getLowStockProducts = catchAsync(async (req, res) => {
  const products = await Product.find({
    isDeleted: false,

    stock: {
      $lt: 5,
    },
  })
    .select("_id name stock image slug")
    .sort({
      stock: 1,
      name: 1,
    })
    .lean();

  res.status(200).json({
    message: "Low stock products fetched successfully",

    data: {
      products,
    },
  });
});

exports.getProductByIdForAdmin = catchAsync(async (req, res, next) => {
  const product = await populateProduct(
    Product.findOne({
      _id: req.params.id,

      isDeleted: false,
    }),
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    message: "Product fetched successfully",

    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,

    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const {
    name,
    price,
    description,
    slug,
    stock,
    category,
    subCategory,
    rating,
    isActive,
    isNewArrival,
    isTopSeller,
  } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      return next(new AppError("Product name cannot be empty", 400));
    }

    product.name = name.trim();
  }

  if (description !== undefined) {
    if (!description.trim()) {
      return next(new AppError("Product description cannot be empty", 400));
    }

    product.description = description.trim();
  }

  if (price !== undefined) {
    if (Number(price) < 0) {
      return next(new AppError("Price cannot be negative", 400));
    }

    product.price = Number(price);
  }

  if (stock !== undefined) {
    if (Number(stock) < 0) {
      return next(new AppError("Stock cannot be negative", 400));
    }

    product.stock = Number(stock);
  }

  if (slug !== undefined) {
    const normalizedSlug = slug.trim().toLowerCase();

    const existingProduct = await Product.findOne({
      slug: normalizedSlug,

      _id: {
        $ne: product._id,
      },

      isDeleted: false,
    });

    if (existingProduct) {
      return next(new AppError("Product slug already exists", 409));
    }

    product.slug = normalizedSlug;
  }

  if (category !== undefined) {
    const myCategory = await Category.findOne({
      _id: category,

      isDeleted: false,
    });

    if (!myCategory) {
      return next(new AppError("Category not found", 404));
    }

    product.category = category;
  }

  if (subCategory !== undefined) {
    const mySubCategory = await SubCategory.findOne({
      _id: subCategory,

      isDeleted: false,
    });

    if (!mySubCategory) {
      return next(new AppError("Subcategory not found", 404));
    }

    const categoryId = category !== undefined ? category : product.category;

    if (mySubCategory.category.toString() !== categoryId.toString()) {
      return next(
        new AppError("Subcategory does not belong to this category", 400),
      );
    }

    product.subCategory = subCategory;
  }

  if (rating !== undefined) {
    const myRating = Number(rating);

    if (myRating < 0 || myRating > 5) {
      return next(new AppError("Rating must be between 0 and 5", 400));
    }

    product.rating = myRating;
  }

  if (isActive !== undefined) {
    product.isActive = parseBoolean(isActive);
  }

  if (isNewArrival !== undefined) {
    product.isNewArrival = parseBoolean(isNewArrival);
  }

  if (isTopSeller !== undefined) {
    product.isTopSeller = parseBoolean(isTopSeller);
  }

  if (req.file) {
    product.image = req.file.filename;
  }

  await product.save();

  const updatedProduct = await populateProduct(Product.findById(product._id));

  logger.info(`Product updated: ${product.name} by admin ${req.user.name}`);

  res.status(200).json({
    message: "Product updated successfully",

    data: {
      product: updatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,

    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  product.isDeleted = true;

  product.isActive = false;

  await product.save();

  logger.info(`Product deleted: ${product.name} by admin ${req.user.name}`);

  res.status(200).json({
    message: "Product deleted successfully",

    data: {
      productId: product._id,
    },
  });
});
