import { Router } from "express";
import {
  createUser,
  getUsers,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/authMiddleWare";
const router = Router();

// Route to register a new user (sends verification code)
router.post("/users/register", createUser);

// Route to verify email with the received code
router.post("/users/verify-email", verifyEmail);

// Route to resend the verification code
router.post("/users/resend-code", resendVerificationCode);

router.get("/users", authenticateJWT, getUsers);
router.post("/users/login", loginUser);
router.post("/users/logout", authenticateJWT, logoutUser);

export default router;
