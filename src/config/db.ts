import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  }
);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tables synced");
  })
  .catch((err) => {
    console.error("Error syncing tables:", err);
  });

export default sequelize;
