import { Request, Response, Router } from "express";
import User from "../models/user.model";
import logger from "../utils/logger";
const router = Router();
router.get("/users", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await User.paginate(Number(page), Number(limit));
    res.status(200).json({
      message: "List of users retrieved successfully",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error("Error retrieving users:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
});
router.post("/users", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      status,
      address,
    } = req.body;
    const result = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      status,
      address,
    });
    res.status(200).json({
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
});

export default router;
