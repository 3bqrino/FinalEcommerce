const mongoose = require("mongoose");
require("dotenv").config();

const SubCategory = require("./models/sub-category.model");
const Product = require("./models/product.model");
const User = require("./models/user.model");
const Order = require("./models/order.model");

async function connectDB() {
  await mongoose.connect(process.env.DB_URI);
  console.log("✅ MongoDB connected");
}

async function seedProducts() {
  const subCategories = await SubCategory.find({ isActive: true, isDeleted: false });
  let created = 0;

  for (const subCategory of subCategories) {
    for (let i = 1; i <= 12; i++) {
      const slug = `seed-${subCategory.slug}-${i}`;

      const exists = await Product.exists({ slug });
      if (exists) continue;

      await Product.create({
        name: `${subCategory.name} Essential ${i}`,
        description: `AURA test product ${i} for ${subCategory.name}.`,
        price: 650 + i * 75,
        image: "1788964078977_Must-Have_Lightweight_Jacket_for_Fashion_Lovers.jpg",
        stock: 15 + i,
        slug,
        category: subCategory.category,
        subCategory: subCategory._id,
        rating: Number((4 + (i % 6) / 10).toFixed(1)),
        isActive: true,
        isNewArrival: i <= 4,
        isTopSeller: i <= 3,
        isDeleted: false,
      });

      created++;
    }
  }

  console.log(`✅ Created ${created} products`);
}

async function seedUsers() {
  const users = [
    ["Ahmed Hassan", "ahmed@test.com", "01011111111", "29501011234567", "male"],
    ["Omar Ali", "omar@test.com", "01022222222", "29502021234567", "male"],
    ["Karim Mohamed", "karim@test.com", "01033333333", "29503031234567", "male"],
    ["Sara Ahmed", "sara@test.com", "01044444444", "29804041234567", "female"],
    ["Mariam Hassan", "mariam@test.com", "01055555555", "29805051234567", "female"],
  ];

  for (const [name, email, phone, nationalId, gender] of users) {
    const exists = await User.exists({ email });
    if (exists) continue;

    await User.create({
      name,
      email,
      phone,
      nationalId,
      gender,
      password: "123456",
      role: "user",
      isActive: true,
      isBlocked: false,
      isDeleted: false,
    });
  }

  console.log("✅ Test users ready");
}

async function seedOrders() {
  const users = await User.find({ email: /@test\.com$/ }).limit(5);
  const products = await Product.find({ slug: /^seed-/, isDeleted: false }).limit(10);

  if (!users.length || !products.length) {
    console.log("⚠️ Users/products missing, orders skipped");
    return;
  }

  const statuses = ["delivered", "processing", "shipped", "pending", "confirmed"];
  let created = 0;

  for (let i = 0; i < users.length; i++) {
    const product = products[i % products.length];
    const quantity = (i % 3) + 1;

    const exists = await Order.exists({
      user: users[i]._id,
      "items.product": product._id,
    });

    if (exists) continue;

    const subtotal = product.price * quantity;
    const deliveryFee = 60;

    await Order.create({
      user: users[i]._id,
      items: [{
        product: product._id,
        name: product.name,
        image: product.image,
        quantity,
        price: product.price,
        totalPrice: subtotal,
      }],
      shippingAddress: {
        name: users[i].name,
        governorate: "Cairo",
        city: "Nasr City",
        street: "Test Street",
        building: String(10 + i),
      },
      subtotal,
      deliveryFee,
      totalAmount: subtotal + deliveryFee,
      status: statuses[i],
    });

    created++;
  }

  console.log(`✅ Created ${created} test orders`);
}

async function seed() {
  try {
    await connectDB();
    await seedProducts();
    await seedUsers();
    await seedOrders();
    console.log("🎉 Seed finished");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
