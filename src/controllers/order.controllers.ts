import { Request, Response } from "express";
import logger from "../utils/logger";

import Order from "../models/order.model";

interface User {
  id: string;
  name: string;
  email: string;
  userName: string;
  password: string;
}

interface CustomRequest extends Request {
  user?: User;
}

export const createOrder = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    console.log(userId);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { productId, quantity, totalPrice } = req.body;

    const order = await Order.create({
      productId,
      quantity,
      userId,
      totalPrice,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    logger.error("Error creating order:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

// Get All Orders
export const getOrders = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { page = 1, limit = 10 } = req.query;
    const result = await Order.paginate(Number(page), Number(limit), {
      order: [["id", "DESC"]],
      where: { userId },
    });

    res.status(200).json({
      message: "Orders List retrieved successfully",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error("Error retrieving orders:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};
