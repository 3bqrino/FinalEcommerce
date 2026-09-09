const mongoose = require("mongoose");
exports.connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI);
    console.log(`database connected: ${connection.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
