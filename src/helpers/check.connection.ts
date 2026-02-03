import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECOND = 5000;

const checkConnection = () => {
  const numConnections = mongoose.connections.length;

  console.log(`Number of connections: ${numConnections}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;

    // Example of max connections based on CPU cores
    const maxConnection = numCores * 5;

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage} MB`);

    if (numConnections > maxConnection) {
      console.log("Overload connection detected!");
    }
  }, _SECOND);
};

export { checkConnection, checkOverload };
