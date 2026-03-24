import { AccessService } from "@/services";
import { NextFunction, Request, Response } from "express";

class AccessController {
  // constructor(private readonly accessService) {}

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AccessService.signUp(req.body);

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default new AccessController();
