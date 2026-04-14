import { HEADER } from "@/constants";
import { ApiKeyService } from "@/services";
import { NextFunction, Request, Response } from "express";

export const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKeyHeader = req.headers[HEADER.API_KEY] as string;

  if (!apiKeyHeader) {
    return res.status(403).json({
      message: "Forbidden Error",
    });
  }

  const apiKeyObject = await ApiKeyService.findById(apiKeyHeader);

  if (!apiKeyObject) {
    return res.status(403).json({
      message: "Forbidden Error",
    });
  }

  req.apiKeyObject = apiKeyObject;

  return next();
};

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.apiKeyObject?.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    const validPermission = req.apiKeyObject?.permissions.includes(
      permission as "0000" | "1111" | "2222",
    );

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};
