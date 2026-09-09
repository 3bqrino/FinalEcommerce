const cors = require("cors");
const allowedOigins = process.env.ALLOWED_ORIGINs;

const corsOptions = {
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);

    if (allowedOigins.includes(origin)) {
      return cb(null, true);
    } else {
      return cb(new Error("Origin policy: Origion not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
