import mongoose from "mongoose";

if (true) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

const connectString = "mongodb://localhost:27017/mydatabase";

mongoose.connect(connectString).then(() => {
  console.log("Database connect successfully!");
});

export { mongoose };
