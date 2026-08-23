import envConfig from "@/configs/env.config";
import winston from "winston";

const { combine, timestamp, json, align, printf } = winston.format;

const winstonLogger = winston.createLogger({
  level: envConfig.winston.logLevel ?? "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: "logs",
      filename: "test.log",
    }),
  ],
});

export default winstonLogger;
