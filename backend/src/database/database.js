import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const usarNeon = process.env.USE_NEON === "true";

export const sequelize = new Sequelize(
  usarNeon ? process.env.DB_REMOTE_NAME : process.env.DB_LOCAL_NAME,
  usarNeon ? process.env.DB_REMOTE_USER : process.env.DB_LOCAL_USER,
  usarNeon ? process.env.DB_REMOTE_PASSWORD : process.env.DB_LOCAL_PASSWORD,
  {
    host: usarNeon ? process.env.DB_REMOTE_HOST : process.env.DB_LOCAL_HOST,
    port: usarNeon ? process.env.DB_REMOTE_PORT : process.env.DB_LOCAL_PORT,
    dialect: "postgres",
    dialectOptions: usarNeon
      ? { ssl: { require: true, rejectUnauthorized: false } } // necesario para Neon
      : {},
    logging: false
  }
);
