require("dotenv").config();

const fs = require("fs");

const express = require("express");

const path = require("path");

const corsMiddleware = require("./middlewares/cors.middleware");

const { connectDB } = require("./config/db.config");

const AppError = require("./utilities/appError.util");

const globalError = require("./middlewares/errorHandelar.middleware");

const authRoute = require("./routes/auth.route");

const userRoute = require("./routes/user.route");

const categoryRoute = require("./routes/category.route");

const subCategoryRoute = require("./routes/subCategory.route");

const productRoute = require("./routes/product.route");

const cartRoute = require("./routes/cart.route");

const orderRoute = require("./routes/order.route");

const messageRoute = require("./routes/message.route");

const testimonialRoute = require("./routes/testimonial.route");

const shippingRoute = require("./routes/shipping.route");

const reportRoute = require("./routes/report.route");

const refundRoutes = require("./routes/refund.routes");

const aboutHomeRoute = require("./routes/about.home.route");

const categoryHomeRoute = require("./routes/category.home.route");

const heroHomeRoute = require("./routes/hero.home.route");

const promoBannerHomeRoute = require("./routes/promo-banner.home.route");

const subCategoryHomeRoute = require("./routes/subCategory.home.route");

const footerHomeRoute = require("./routes/footer.home.route");

const app = express();

const port = process.env.PORT || 3000;

if (!fs.existsSync("./log")) {
  fs.mkdirSync("./log");
}

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

connectDB();

app.use(corsMiddleware);

app.use(express.json());

app.use("/files", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoute);

app.use("/api/v1/users", userRoute);

app.use("/api/v1/categories", categoryRoute);

app.use("/api/v1/subcategories", subCategoryRoute);

app.use("/api/v1/products", productRoute);

app.use("/api/v1/cart", cartRoute);

app.use("/api/v1/orders", orderRoute);

app.use("/api/v1/messages", messageRoute);

app.use("/api/v1/testimonials", testimonialRoute);

app.use("/api/v1/shipping", shippingRoute);

app.use("/api/v1/reports", reportRoute);

app.use("/api/v1/refunds", refundRoutes);

app.use("/api/v1/home/about", aboutHomeRoute);

app.use("/api/v1/home/categories", categoryHomeRoute);

app.use("/api/v1/home/hero", heroHomeRoute);

app.use("/api/v1/home/promo-banner", promoBannerHomeRoute);

app.use("/api/v1/home/subcategories", subCategoryHomeRoute);

app.use("/api/v1/home/footer", footerHomeRoute);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError);

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
