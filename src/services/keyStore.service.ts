import { keyStoreModel } from "@/models";
import { Types } from "mongoose";

class KeyStoreService {
  static createKeyStore = async ({
    shopId,
    privateKey,
    publicKey,
    refreshToken,
  }: {
    shopId: string;
    privateKey: string;
    publicKey: string;
    refreshToken?: string | undefined;
  }): Promise<string | null> => {
    try {
      /* Solution 1 */
      // const token = await keyStoreModel.create({
      //   shop: shopId,
      //   privateKey,
      //   publicKey,
      // });

      /* Solution 2 */
      const filter = { shop: shopId };
      const update = {
        privateKey,
        publicKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyStoreModel.findOneAndUpdate(
        filter,
        update,
        options,
      );

      return tokens ? tokens.publicKey : null;
    } catch (error: any) {
      return error;
    }
  };

  static findByShopId = async (shopId: string) => {
    return await keyStoreModel.findOne({ shop: shopId }).lean();
  };

  static findByRefreshToken = async (refreshToken: string) => {
    return await keyStoreModel.findOne({ refreshToken: refreshToken });
  };

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    return await keyStoreModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static updateRefreshToken = async (
    refreshToken: string,
    newRefreshToken: string,
  ) => {
    return await keyStoreModel.updateOne(
      { refreshToken },
      {
        $set: { refreshToken: newRefreshToken },
        $addToSet: { refreshTokensUsed: refreshToken },
      },
    );
  };

  static deleteById = async (keyStoreId: Types.ObjectId) => {
    return await keyStoreModel.deleteOne({ _id: keyStoreId });
  };

  static deleteByShopID = async (shopId: string) => {
    return await keyStoreModel.deleteOne({ shop: shopId });
  };
}

export default KeyStoreService;
