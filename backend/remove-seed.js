const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product.model");

async function removeSeedProducts() {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log("✅ MongoDB connected");

    const result = await Product.deleteMany({
      slug: /^seed-/,
    });

    console.log(`🗑️ Deleted ${result.deletedCount} seeded products`);

    await mongoose.disconnect();

    console.log("🎉 Done");
    process.exit(0);
  } catch (error) {
    console.error("❌ Delete failed:", error.message);
    process.exit(1);
  }
}

removeSeedProducts();