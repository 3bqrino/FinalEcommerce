const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const catchAsync = require("../utilities/catchAsync.util");

exports.getReports = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    refundedOrders,

    lowStockProducts,
    lowStockProductList,
  ] = await Promise.all([
    User.countDocuments({
      isDeleted: false,
    }),

    Product.countDocuments({
      isDeleted: false,
    }),

    Order.countDocuments(),

    Order.countDocuments({
      status: "pending",
    }),

    Order.countDocuments({
      status: "confirmed",
    }),

    Order.countDocuments({
      status: "processing",
    }),

    Order.countDocuments({
      status: "shipped",
    }),

    Order.countDocuments({
      status: "delivered",
    }),

    Order.countDocuments({
      status: "cancelled",
    }),

    Order.countDocuments({
      status: "refunded",
    }),

    Product.countDocuments({
      isDeleted: false,
      stock: {
        $lt: 5,
      },
    }),

    Product.find({
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
      .lean(),
  ]);

  const validOrders = await Order.find({
    status: {
      $nin: ["cancelled", "refunded"],
    },
  })
    .select("user totalAmount status items createdAt")
    .populate("user", "name email")
    .populate({
      path: "items.product",
      select: "name image category slug",
      populate: {
        path: "category",
        select: "name slug",
      },
    })
    .lean();

  const totalSales = validOrders.reduce((total, order) => {
    return total + Number(order.totalAmount || 0);
  }, 0);

  const totalItemsSold = validOrders.reduce((total, order) => {
    if (!Array.isArray(order.items)) {
      return total;
    }

    return (
      total +
      order.items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
      }, 0)
    );
  }, 0);

  const averageOrderValue =
    validOrders.length > 0 ? totalSales / validOrders.length : 0;

  const usersMap = new Map();

  validOrders.forEach((order) => {
    if (!order.user?._id) {
      return;
    }

    const userId = order.user._id.toString();

    if (!usersMap.has(userId)) {
      usersMap.set(userId, {
        _id: order.user._id,

        name: order.user.name || "Unknown User",

        email: order.user.email || "",

        orders: 0,

        totalSpent: 0,
      });
    }

    const user = usersMap.get(userId);

    user.orders += 1;

    user.totalSpent += Number(order.totalAmount || 0);
  });

  const topUsers = Array.from(usersMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const productsMap = new Map();

  validOrders.forEach((order) => {
    if (!Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((item) => {
      if (!item.product?._id) {
        return;
      }

      const productId = item.product._id.toString();

      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          _id: item.product._id,

          name: item.product.name || "Unknown Product",

          image: item.product.image || "",

          category: item.product.category?.name || "PRODUCT",

          slug: item.product.slug || "",

          sold: 0,

          revenue: 0,
        });
      }

      const product = productsMap.get(productId);

      const quantity = Number(item.quantity || 0);

      const itemPrice =
        Number(item.priceAtPurchase) ||
        Number(item.priceAtAdd) ||
        Number(item.price) ||
        Number(item.unitPrice) ||
        0;

      product.sold += quantity;

      product.revenue += quantity * itemPrice;
    });
  });

  const topProducts = Array.from(productsMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const now = new Date();

  const createMonthlyData = (monthsCount) => {
    const months = [];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        year: date.getFullYear(),

        month: date.getMonth(),

        monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}`,

        label: date.toLocaleString("en-US", {
          month: "short",
        }),

        revenue: 0,

        orders: 0,

        itemsSold: 0,
      });
    }

    return months;
  };

  const salesByMonth6 = createMonthlyData(6);

  const salesByMonth12 = createMonthlyData(12);

  const salesMap = new Map();

  validOrders.forEach((order) => {
    if (!order.createdAt) {
      return;
    }

    const date = new Date(order.createdAt);

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    if (!salesMap.has(monthKey)) {
      salesMap.set(monthKey, {
        revenue: 0,
        orders: 0,
        itemsSold: 0,
      });
    }

    const monthData = salesMap.get(monthKey);

    monthData.revenue += Number(order.totalAmount || 0);

    monthData.orders += 1;

    if (Array.isArray(order.items)) {
      monthData.itemsSold += order.items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
      }, 0);
    }
  });

  const fillMonthlyData = (months) => {
    return months.map((month) => {
      const data = salesMap.get(month.monthKey);

      return {
        month: month.monthKey,

        label: month.label,

        revenue: data?.revenue || 0,

        orders: data?.orders || 0,

        itemsSold: data?.itemsSold || 0,
      };
    });
  };

  const finalSalesByMonth6 = fillMonthlyData(salesByMonth6);

  const finalSalesByMonth12 = fillMonthlyData(salesByMonth12);

  res.status(200).json({
    message: "Reports fetched successfully",

    data: {
      totalUsers,

      totalProducts,

      totalOrders,

      totalSales,

      totalItemsSold,

      averageOrderValue,

      pendingOrders,

      confirmedOrders,

      processingOrders,

      shippedOrders,

      deliveredOrders,

      cancelledOrders,

      refundedOrders,

      lowStockProducts,

      lowStockProductList,

      topUsers,

      topProducts,

      salesByMonth6: finalSalesByMonth6,

      salesByMonth12: finalSalesByMonth12,
    },
  });
});
