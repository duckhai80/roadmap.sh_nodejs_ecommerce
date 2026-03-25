import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      objectKey?: any;
      user?: any;
    }
  }
}
