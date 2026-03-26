import { keyStoreModel } from "@/models";
import { Types } from "mongoose";

class KeyStoreService {
  static createKeyToken = async ({
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

  static deleteById = async (keyStoreId: Types.ObjectId) => {
    return await keyStoreModel.deleteOne({ _id: keyStoreId });
  };
}

export default KeyStoreService;
