import "dotenv/config"
import DailyRotateFile from "winston-daily-rotate-file"
import { createLogger, format, transports } from "winston"

const isProduction = process.env.NODE_ENV === "production"

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
  defaultMeta: { service: "nodejsAdv" },
  format: format.combine(format.timestamp(), format.errors({ stack: true })),
  transports: [
    new transports.Console({
      format: isProduction
        ? format.json()
        : format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, stack, ...metadata }) => {
              const details = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : ""
              return `${timestamp} ${level}: ${stack ?? message}${details}`
            }),
          ),
    }),
    new DailyRotateFile({
      dirname: "logs",
      filename: "application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: format.json(),
    }),
  ],
})

export default logger
