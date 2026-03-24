import crypto from "crypto";
import JWT from "jsonwebtoken";

export const createTokenPair = async (
  payload: any,
  privateKey: string,
  publicKey: string,
) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    await JWT.verify(accessToken, publicKey, (error, decode) => {
      console.log("🚀 ~ createTokenPair ~ decode:", decode);
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};
