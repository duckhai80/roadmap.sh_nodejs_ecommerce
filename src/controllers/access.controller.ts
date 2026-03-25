import { CREATED, OK } from "@/core";
import { AccessService } from "@/services";
import { Request, Response } from "express";

class AccessController {
  // constructor(private readonly accessService) {}

  login = async (req: Request, res: Response) => {
    return new OK({
      message: "Login OK!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req: Request, res: Response) => {
    return new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signUp(req.body),
      // Mock options property
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

export default new AccessController();
