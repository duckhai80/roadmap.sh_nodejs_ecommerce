import { keyTokenModel } from "@/models";

class KeyTokenService {
  static createKeyToken = async ({
    shopId,
    privateKey,
    publicKey,
    refreshToken,
  }: {
    shopId: string;
    privateKey: string;
    publicKey: string;
    refreshToken?: string;
  }): Promise<string | null> => {
    try {
      /* Solution 1 */
      // const token = await keyTokenModel.create({
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
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );

      return tokens ? tokens.publicKey : null;
    } catch (error: any) {
      return error;
    }
  };
}

export default KeyTokenService;
