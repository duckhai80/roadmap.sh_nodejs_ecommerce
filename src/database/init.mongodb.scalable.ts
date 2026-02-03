import { config } from "@/configs/mongodb.config";
import mongoose, { Connection, MongooseError } from "mongoose";

const connectString = `mongodb://${config?.db.host}:${config?.db.port}/${config?.db.name}`;
const _MAX_POOL_SIZE = 50;

class MongoDB {
  private static instance: MongoDB;
  private connection: Connection | null = null;

  constructor() {
    if (MongoDB.instance) {
      return MongoDB.instance;
    }

    this.connection = null;

    MongoDB.instance = this;
  }

  async connect() {
    try {
      if (this.connection) {
        return this.connection;
      }

      if (true) {
        mongoose.set("debug", true);
        mongoose.set("debug", { color: true });
      }

      await mongoose.connect(connectString, { maxPoolSize: _MAX_POOL_SIZE });
      console.log("Connect MongoDB successfully!");

      this.connection = mongoose.connection;

      return this.connection;
    } catch (error) {
      console.log(
        "MongoDB connection failed: ",
        (error as MongooseError).message,
      );
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();

      console.log("Disconnect MongoDB successfully!");

      this.connection = null;
    } catch (error) {
      console.log(
        "MongoDB disconnection failed: ",
        (error as MongooseError).message,
      );
    }
  }
}

const mongoDbInstance = new MongoDB();

export { mongoDbInstance };
