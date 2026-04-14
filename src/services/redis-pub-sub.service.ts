import redis from "redis";

class RedisPubSubService {
  private subscriber: redis.RedisClientType;
  private publisher: redis.RedisClientType;

  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
  }

  async publish(channel: string, message: string) {
    try {
      await this.publisher.connect();
      return this.publisher.publish(channel, message);
    } catch (error) {
      console.error(error);
    }
  }

  async subscribe(
    channels: string | string[],
    callback: (message: string, channel: string) => void,
  ) {
    await this.subscriber.connect();
    this.subscriber.subscribe(channels, callback);
    // this.subscriber.on("message", (subscribeChannel, message) => {
    //   if (channel === subscribeChannel) {
    //     callback(channel, message);
    //   }
    // });
  }
}

export default new RedisPubSubService();
