import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import logger from "./utils/logger";
import sequelize from "./config/db";
import { Server } from "http";
import helmet from "helmet";
import path from "path";

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());

app.use("/uploads", express.static(path.join(__dirname, ".", "uploads")));

app.use("/", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

const gracefulShutdown = (server: Server) => () => {
  server.close(() => {
    sequelize.close().then(() => {
      process.exit(0);
    });
  });
};

const PORT = process.env.PORT ?? 4000;

const startServer = async () => {
  try {
    // await sequelize.sync({ alter: true });
    console.log("Database connected");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    process.on("SIGTERM", gracefulShutdown(server));
    process.on("SIGINT", gracefulShutdown(server));
  } catch (e) {
    console.error(e);
    logger.error("Failed to start server:", (e as Error).message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

startServer();
