import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "@/routes";
import createHttpError from "http-errors";

const app = express();

dotenv.config();

// Init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Define routes
app.use("/", router);
app.use((req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Handling errors

export { app };
