import { HEADER } from "@/constants";
import { AuthFailureError, NotFoundError } from "@/core";
import { KeyStoreService } from "@/services";
import { JWTPayload, verifyToken } from "@/utils";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "./catchAsync.middleware";

export const checkAuthentication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check shopId exists
    const shopId = req.headers[HEADER.CLIENT_ID] as string;

    if (!shopId) throw new AuthFailureError("Invalid request");

    // Check keyStore with shopId?
    const keyStore = await KeyStoreService.findByShopId(shopId);

    if (!keyStore) throw new NotFoundError("Not found key token");

    // Get access token
    const accessToken = (req.headers[HEADER.AUTHORIZATION] as string).split(
      " ",
    )[1];

    if (!accessToken) throw new AuthFailureError("Invalid request");

    // Verify token
    try {
      const decodedToken = (await verifyToken(
        accessToken,
        keyStore.publicKey,
      )) as JWTPayload;

      if (shopId !== decodedToken.shopId)
        throw new AuthFailureError("ShopId not match");

      req.keyStore = keyStore;

      return next();
    } catch (error) {
      throw error;
    }
  },
);
