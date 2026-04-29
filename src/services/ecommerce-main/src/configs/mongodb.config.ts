import envConfig from "./env.config";

const dev = {
  app: {
    port: envConfig.app.port || 3052,
  },
  db: {
    host: envConfig.db.host || "localhost",
    port: envConfig.db.port || 27017,
    name: envConfig.db.name || "shopDEV",
  },
};

const prod = {
  app: {
    port: envConfig.app.port || 3052,
  },
  db: {
    host: envConfig.app.port || "localhost",
    port: envConfig.app.port || 27017,
    name: envConfig.app.port || "shopPROD",
  },
};

const env = process.env.NODE_ENV || "dev";
const config = { dev, prod }[env];

export { config };
