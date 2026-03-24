import redisClient from "@/configs/redis.config";
import express from "express";
import fs from "fs";
import createError from "http-errors";
import JWT from "jsonwebtoken";
import path from "path";

const jwtRouter = express.Router();
const privateKey = fs.readFileSync(
  path.join(process.cwd(), "certs/private.pem"),
);
const publicKey = fs.readFileSync(path.join(process.cwd(), "certs/public.pem"));

const signAccessToken = async () => {
  return JWT.sign(
    { sub: "1234", roles: ["admin"], type: "access" },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: 20,
    },
  );
};

const signRefreshToken = async () => {
  const token = await JWT.sign(
    { sub: "1234", roles: ["admin"], type: "refresh" },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: "7d",
    },
  );

  await redisClient.set("1234", token, {
    expiration: { type: "EX", value: 60 * 60 * 24 * 7 },
  });

  return token;
};

const verifyAccessToken = (token: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, publicKey, (error, decoded) => {
      if (error) {
        reject(error);
      }

      resolve(decoded);
    });
  });
};

const verifyRefreshToken = (token: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, publicKey, async (error, decoded) => {
      if (error) {
        reject(error);
      }

      const redisTokenValue = await redisClient.get(decoded?.sub);

      if (token === redisTokenValue) {
        resolve(decoded);
      }

      if (!redisTokenValue) {
        reject(Error("Refresh token không tồn tại"));
      }

      reject(createError.Unauthorized());
    });
  });
};

const authProtect = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return next(createError.Unauthorized("Unauthorized!"));
    }

    const accessToken = req.headers.authorization?.split(" ")[1] || "";

    req.user = await verifyAccessToken(accessToken);

    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return next(createError.Unauthorized("Token hết hạn"));
    }

    if (error?.name === "JsonWebTokenError") {
      return next(createError.Unauthorized("Token không hợp lệ"));
    }

    next(createError.Unauthorized());
  }
};

jwtRouter.get("/list-users", authProtect, (req, res, next) => {
  const userList = [{ email: "abc@gmail.com" }, { email: "def@gmail.com" }];

  return res.status(200).json({
    data: userList,
  });
});

jwtRouter.post("/login", async (req, res, next) => {
  const accessToken = await signAccessToken();
  const refreshToken = await signRefreshToken();

  return res.status(200).json({
    accessToken,
    refreshToken,
  });
});

jwtRouter.delete("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw next(createError.BadRequest());
    }

    const payload = await verifyRefreshToken(refreshToken);

    await redisClient.del(payload?.sub);

    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    next(error);
  }
});

jwtRouter.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw next(createError.BadRequest());
    }

    const payload = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken();
    const newRefreshToken = await signRefreshToken();

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
});

export default jwtRouter;
