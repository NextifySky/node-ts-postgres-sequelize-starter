import { Router } from "express";
import {
  createUser,
  getUsers,
  loginUser,
  logoutUser,
} from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/authMiddleWare";
const router = Router();

router.get("/users", authenticateJWT, getUsers);
router.post("/users/create", authenticateJWT, createUser);
router.post("/users/login", loginUser);
router.post("/users/logout", authenticateJWT, logoutUser);

export default router;
