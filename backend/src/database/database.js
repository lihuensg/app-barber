import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const usarNeon = process.env.USE_NEON === "true";

export const sequelize = usarNeon
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false
    })
  : new Sequelize(
      process.env.DB_LOCAL_NAME,
      process.env.DB_LOCAL_USER,
      process.env.DB_LOCAL_PASSWORD,
      {
        host: process.env.DB_LOCAL_HOST,
        port: process.env.DB_LOCAL_PORT,
        dialect: "postgres",
        logging: false
      }
    );
