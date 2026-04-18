import { AuthFailureError, CREATED, OK } from "@/core";
import { accessService } from "@/services";
import { Request, Response } from "express";

class AccessController {
  // constructor(private readonly accessService) {}

  handleRefreshToken = async (req: Request, res: Response) => {
    return new OK({
      message: "Token refreshed successfully!",
      metadata: await accessService.handleRefreshToken(
        req.keyStore!,
        req.shop,
        req.body.refreshToken,
      ),
    }).send(res);
  };

  login = async (req: Request, res: Response) => {
    return new OK({
      message: "Logged in successfully!",
      metadata: await accessService.login(req.body),
    }).send(res);
  };

  signup = async (req: Request, res: Response) => {
    return new CREATED({
      message: "Registered successfully!",
      metadata: await accessService.signup(req.body),
    }).send(res);
  };

  logout = async (req: Request, res: Response) => {
    const { keyStore } = req;

    if (!keyStore) throw new AuthFailureError("Keystore not found");

    return new OK({
      message: "Logged out successfully!",
      metadata: await accessService.logout(req.keyStore!),
    }).send(res);
  };
}

export default new AccessController();
