const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: process.env.NODE_ENV === "dev" ? "debug" : "info",
  format: format.combine(
    format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} | ${level.toUpperCase()} | ${message} ${stack ? `\n${stack}` : ""} `;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "log/combind.log" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
  ],
});

module.exports = logger;
