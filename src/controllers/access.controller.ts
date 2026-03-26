import { AuthFailureError, CREATED, OK } from "@/core";
import { AccessService } from "@/services";
import { Request, Response } from "express";

class AccessController {
  // constructor(private readonly accessService) {}

  handleRefreshToken = async (req: Request, res: Response) => {
    return new OK({
      message: "Refresh token success!",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };

  login = async (req: Request, res: Response) => {
    return new OK({
      message: "Login success!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signup = async (req: Request, res: Response) => {
    return new CREATED({
      message: "Register success!",
      metadata: await AccessService.signup(req.body),
      // Mock options property
      options: {
        limit: 10,
      },
    }).send(res);
  };

  logout = async (req: Request, res: Response) => {
    const { keyStore } = req;

    if (!keyStore) throw new AuthFailureError("Keystore not found");

    return new OK({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore!),
    }).send(res);
  };
}

export default new AccessController();
