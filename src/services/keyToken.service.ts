import { keyTokenModel } from "@/models";

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
  }: {
    userId: string;
    privateKey: string;
    publicKey: string;
  }): Promise<string | null> => {
    try {
      const token = await keyTokenModel.create({
        user: userId,
        privateKey,
        publicKey,
      });

      return token ? token.publicKey : null;
    } catch (error: any) {
      return error;
    }
  };
}

export default KeyTokenService;
