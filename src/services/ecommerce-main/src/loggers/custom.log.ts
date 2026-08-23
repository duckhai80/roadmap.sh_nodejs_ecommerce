import { v4 as uuidV4 } from "uuid";
import winston from "winston";
import "winston-daily-rotate-file";

const { combine, printf, timestamp, align } = winston.format;

class CustomLogger {
  logger: winston.Logger;

  constructor() {
    const formatPrintf = printf(
      ({ timestamp, level, context, requestId, message, metadata }) =>
        `${timestamp} - ${level} - ${context} - ${requestId} - ${message} - ${JSON.stringify(metadata)}`,
    );

    const onlyLevel = (level: string) =>
      winston.format((info) => (info.level === level ? info : false))();

    this.logger = winston.createLogger({
      // format: combine(
      //   timestamp({
      //     format: "YYYY-MM-DD hh:mm:ss",
      //   }),
      //   formatPrintf,
      // ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: "info",
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: combine(
            onlyLevel("info"),
            timestamp({
              format: "YYYY-MM-DD hh:mm:ss A",
            }),
            formatPrintf,
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: "error",
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: combine(
            onlyLevel("error"),
            timestamp({
              format: "YYYY-MM-DD hh:mm:ss A",
            }),
            formatPrintf,
          ),
        }),
      ],
    });
  }

  formatCommonParams(params: any) {
    let context, req, metadata;

    if (!Array.isArray(params)) {
      ({ context, req, metadata } = params);
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId ?? uuidV4();

    return {
      context,
      requestId,
      metadata,
    };
  }

  info(message: string, params: any) {
    const formattedParams = this.formatCommonParams(params);
    const logObject = Object.assign({}, { ...formattedParams });
    this.logger.info(message, logObject);
  }

  error(message: string, params: any) {
    const formattedParams = this.formatCommonParams(params);
    const logObject = Object.assign({}, { ...formattedParams });
    this.logger.error(message, logObject);
  }
}

export default new CustomLogger();
