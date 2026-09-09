module.exports =
  (Model, filter = {}) =>
  async (req, res, next) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const sortBy = req.query.sort || "createdAt";
    const order = req.query.order === "desc" ? -1 : 1;

    const [results, total] = await Promise.all([
      Model.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit),
      Model.countDocuments(filter),
    ]);

    res.paginatedResult = {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
      results,
    };

    next();
  };
