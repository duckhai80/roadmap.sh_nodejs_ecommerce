import { CREATED } from "@/core";
import { AccessService } from "@/services";
import { Request, Response } from "express";

class AccessController {
  // constructor(private readonly accessService) {}

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
