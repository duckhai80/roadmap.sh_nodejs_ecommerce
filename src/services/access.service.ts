import { shopModel } from "@/models";
import { createTokenPair, getInfoData } from "@/utils";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import KeyTokenService from "./keyToken.service";
import { BadRequestError } from "@/core";

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
  signUp = async ({
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
        userId: newShop._id.toString(),
        privateKey,
        publicKey,
      });

      if (!tokenKeys) {
        throw new BadRequestError("Public key string errors!");
      }

      // Create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
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
}

export default new AccessService();
