import "@/configs/env.config";
import router from "@/routes";
import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import createHttpError from "http-errors";
import morgan from "morgan";
import { v4 as uuidV4 } from "uuid";
import { ErrorResponse } from "./core";
import { customLogger } from "./loggers";
import inventoryServiceTest from "./tests/inventory-service.test";
import productServiceTest from "./tests/product-service.test";

const app = express();

// Init middleware
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];

  req.requestId =
    (Array.isArray(requestId) ? requestId[0] : requestId) ?? uuidV4();

  customLogger.info(`${req.method} - input params`, [
    req.path,
    { requestId: req.requestId },
    req.method === "POST" ? req.body : req.query,
  ]);

  next();
});

// Define routes
app.use("/", router);

// Handling errors
app.use((req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});
app.use(
  (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    const errorMessage = `${statusCode} - ${Date.now() - error.now}ms - ${error.message}`;

    console.log("🚀 ~ error:", JSON.stringify(error));

    customLogger.error(errorMessage, [
      req.path,
      { requestId: req.requestId },
      error.stack,
    ]);

    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      // In production, we should not return the stack trace
      stack: error.stack,
      message: error.message || "Internal Server Error",
    });
  },
);

// Test pub/sub Redis
productServiceTest.purchaseProduct("product:001", 10);
inventoryServiceTest;

export { app };
