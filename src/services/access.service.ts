import { AuthFailureError, BadRequestError } from "@/core";
import { shopModel } from "@/models";
import { KeyStore } from "@/models/keyStore.model";
import { createTokenPair, getInfoData, JWTPayload, verifyToken } from "@/utils";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import KeyTokenService from "./keyStore.service";
import ShopService from "./shop.service";
import KeyStoreService from "./keyStore.service";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(
  path.join(__dirname, "../../certs/private.pem"),
  "utf8",
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../../certs/public.pem"),
  "utf8",
);

class AccessService {
  handleRefreshToken = async (refreshToken: string) => {
    // Check refresh token that have been used
    const foundedKeyStore =
      await KeyStoreService.findByRefreshTokenUsed(refreshToken);

    // Handle for found key store used
    if (foundedKeyStore) {
      const { shopId, email } = (await verifyToken(
        refreshToken,
        foundedKeyStore.publicKey,
      )) as JWTPayload;

      console.log(`🚀 ~ AccessService ~ { shopId, email}:`, { shopId, email });

      await KeyStoreService.deleteByShopID(shopId);
      throw new BadRequestError("This refresh token has been used!");
    }

    // Handle for not found key store in used
    const holderKeyStore =
      await KeyStoreService.findByRefreshToken(refreshToken);

    if (!holderKeyStore) throw new AuthFailureError("Shop not registered");

    const { shopId, email } = (await verifyToken(
      refreshToken,
      holderKeyStore.publicKey,
    )) as JWTPayload;

    const foundShop = await ShopService.findOneByEmail(email);

    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // Generate token pair
    const tokens = await createTokenPair(
      { shopId, email },
      holderKeyStore.privateKey,
      holderKeyStore.publicKey,
    );

    // Update key store
    await holderKeyStore.updateOne({
      $set: {
        refreshToken: tokens?.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return { shop: { shopId, email }, tokens };
  };

  login = async ({
    email,
    password,
    refreshToken,
  }: {
    email: string;
    password: string;
    refreshToken: string;
  }) => {
    // Check email exists
    const foundShop = await ShopService.findOneByEmail(email);

    if (!foundShop) {
      throw new BadRequestError("Shop not registered!");
    }

    // Check password
    const match = await bcrypt.compare(password, foundShop.password);

    if (!match) {
      throw new BadRequestError("Invalid credentials!");
    }

    // Create token pair
    const tokens = await createTokenPair(
      { shopId: foundShop._id.toString(), email },
      privateKey,
      publicKey,
    );

    // Save token
    await KeyTokenService.createKeyToken({
      shopId: foundShop._id.toString(),
      privateKey,
      publicKey,
      refreshToken: tokens?.refreshToken,
    });

    // Get data
    return {
      shop: getInfoData({
        object: foundShop,
        fields: ["_id", "email"],
      }),
      tokens,
    };
  };

  signup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const holder = await shopModel.findOne({ email: email }).lean();

    if (holder) {
      throw new BadRequestError("Shop already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // const privateKey = crypto.randomBytes(64).toString("hex");
      // const publicKey = crypto.randomBytes(64).toString("hex");

      const tokenKeys = await KeyTokenService.createKeyToken({
        shopId: newShop._id.toString(),
        privateKey,
        publicKey,
      });

      if (!tokenKeys) {
        throw new BadRequestError("Public key string errors!");
      }

      // Create token pair
      const tokens = await createTokenPair(
        { shopId: newShop._id.toString(), email },
        privateKey,
        publicKey,
      );

      return {
        shop: getInfoData({
          object: newShop,
          fields: ["_id", "email", "name"],
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  logout = async (keyStore: KeyStore) => {
    return await KeyTokenService.deleteById(keyStore._id);
  };
}

export default new AccessService();
