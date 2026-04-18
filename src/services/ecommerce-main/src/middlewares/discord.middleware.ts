import { discordLoggerService } from "@/loggers";
import { NextFunction, Request, Response } from "express";

export const pushLogDiscord = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    discordLoggerService.sendFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.get("host")}${req.originalUrl}`,
    });

    return next();
  } catch (error) {
    next(error);
  }
};
