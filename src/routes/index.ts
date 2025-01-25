import { Router } from "express";
import userRoutes from "./user.routes";
const router = Router();
router.use("/api/v1", userRoutes);
export default router;
