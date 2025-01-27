import { Request, Response } from "express";
import User from "../models/user.model";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await User.paginate(Number(page), Number(limit), {
      order: [["id", "DESC"]],
    });
    res.status(200).json({
      message: "Users List retrieved successfully",
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
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
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
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not Found" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }

    res.status(200).json({
      message: "Login Successfully",
      token: generateToken({ id: user.id, email: user.email }),
    });
  } catch (error) {
    logger.error("Error logging in:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ message: "Token must be provided" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not Found" });
      return;
    }
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    logger.error("Error logging out:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};
