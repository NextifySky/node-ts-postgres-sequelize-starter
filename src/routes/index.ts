import { Router } from "express";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";

const router = Router();

router.use("/api/v1", userRoutes);
router.use("/api/v1", productRoutes);
router.use("/api/v1", orderRoutes);
export default router;
