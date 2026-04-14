import { HEADER } from "@/constants";
import { AuthFailureError, NotFoundError } from "@/core";
import { KeyStoreService } from "@/services";
import { JWTAuthPayload, verifyToken } from "@/utils";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "./catch-async.middleware";

export const checkAuthentication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check shopId exists
    const shopId = req.headers[HEADER.CLIENT_ID] as string;

    if (!shopId) throw new AuthFailureError("Invalid request");

    // Check keyStore with shopId?
    const keyStore = await KeyStoreService.findByShopId(shopId);

    if (!keyStore) throw new NotFoundError("Not found key token");

    /* Check case refresh token and pass throw authentication */
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN] as string;

    if (refreshToken) {
      // Verify refresh token
      const decodedToken = (await verifyToken(
        refreshToken,
        keyStore.publicKey,
      )) as JWTAuthPayload;

      if (shopId !== decodedToken.shopId)
        throw new AuthFailureError("ShopId not match");

      req.keyStore = keyStore;
      req.shop = decodedToken;

      return next();
    }

    /* Check case access token if does not have refresh token */
    const accessToken = (req.headers[HEADER.AUTHORIZATION] as string).split(
      " ",
    )[1];

    if (!accessToken) throw new AuthFailureError("Invalid request");

    // Verify access token
    const decodedToken = (await verifyToken(
      accessToken,
      keyStore.publicKey,
    )) as JWTAuthPayload;

    if (shopId !== decodedToken.shopId)
      throw new AuthFailureError("ShopId not match");

    req.keyStore = keyStore;
    req.shop = decodedToken;

    return next();
  },
);
