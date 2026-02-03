import { app } from "@/app";
import { mongoDbInstance } from "@/database/init.mongodb.scalable";
import { checkConnection, checkOverload } from "@/helpers/check.connection";

const PORT = process.env.PORT || 3056;

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

  checkConnection();
  checkOverload();
})();
