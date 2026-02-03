import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// Init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Define routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello World!".repeat(1000);

  return res.status(200).json({
    message: "API is working!",
    metadata: strCompress,
  });
});

// Handling errors

export { app };
