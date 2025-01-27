import { Router } from "express";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";

const router = Router();

router.use("/api/v1", userRoutes);
router.use("/api/v1", productRoutes);
export default router;
