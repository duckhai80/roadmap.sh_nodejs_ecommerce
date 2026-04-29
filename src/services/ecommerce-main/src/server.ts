import { app } from "@/app";
import envConfig from "@/configs/env.config";
import redisClient from "@/configs/redis.config";
import { mongoDbInstance } from "@/database/init.mongodb.scalable";

const PORT = envConfig.app.port || 3056;

const server = app.listen(PORT, () => {
  console.log(`Web server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit web server");
  });
});

(async function () {
  await mongoDbInstance.connect();

  // checkConnection();
  // checkOverload();
})();

redisClient.connect();
