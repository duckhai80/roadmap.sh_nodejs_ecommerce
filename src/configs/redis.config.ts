import redis from "redis";

const redisClient = redis.createClient({
  socket: {
    port: 6379,
    host: "127.0.0.1",
  },
});

redisClient
  .on("error", (error) => console.error(error))
  .on("ready", () => console.log("Redis is ready!"))
  .on("connect", () => console.log("Redis connect successfully!"));

export default redisClient;
