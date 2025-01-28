import { Router } from "express";
import { createOrder, getOrders } from "../controllers/order.controllers";
import { authenticateJWT } from "../middlewares/authMiddleWare";
const router = Router();

router.post("/orders", authenticateJWT, createOrder);
router.get("/orders", authenticateJWT, getOrders);

export default router;
