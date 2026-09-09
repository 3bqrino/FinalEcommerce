const User = require("../models/user.model");
const Message = require("../models/message.model");

const notifyAdmins = async ({ type, title, message }) => {
  const admins = await User.find({
    role: "admin",
    isActive: true,
    isBlocked: false,
    isDeleted: false,
  }).select("_id");

  if (!admins.length) {
    return [];
  }

  const messages = admins.map((admin) => ({
    recipient: admin._id,
    type,
    title,
    message,
  }));

  return Message.insertMany(messages);
};

module.exports = notifyAdmins;
