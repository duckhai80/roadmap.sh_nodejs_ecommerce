import { ApiKeyService } from "@/services";
import { NextFunction, Request, Response } from "express";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

export const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.headers[HEADER.API_KEY]?.toString();

    if (!apiKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const objectKey = await ApiKeyService.findById(apiKey);

    if (!objectKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objectKey = objectKey;

    return next();
  } catch (error) {}
};

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objectKey?.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    const validPermission = req.objectKey?.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};
