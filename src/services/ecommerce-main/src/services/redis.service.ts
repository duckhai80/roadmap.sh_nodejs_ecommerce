import { reserveInventory } from "@/models";
import redis from "redis";

class RedisService {
  private static client: redis.RedisClientType;

  static async getClient() {
    if (!this.client) {
      this.client = redis.createClient();

      await this.client.connect();
    }

    return this.client;
  }

  static async acquireLock({
    cartId,
    productId,
    quantity,
    redisClient,
  }: {
    cartId: string;
    productId: string;
    quantity: number;
    redisClient: redis.RedisClientType;
  }) {
    const keyLock = `lock_v2026_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
      const result = await redisClient.setNX(keyLock, expireTime.toString());

      if (result === 1) {
        // Operate with inventory
        const reservation = await reserveInventory({
          cartId,
          productId,
          quantity,
        });

        if (reservation?.modifiedCount) {
          await redisClient.pExpire(keyLock, expireTime, "NX");
          return keyLock;
        }

        return null;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }

  static async releaseLock({
    keyLock,
    redisClient,
  }: {
    keyLock: string;
    redisClient: redis.RedisClientType;
  }) {
    return await redisClient.del(keyLock);
  }
}

export default RedisService;
