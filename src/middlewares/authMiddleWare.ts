import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken";

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

export const authenticateJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res
      .status(401)
      .json({ success: false, message: "Authorization header missing" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Token missing" });
    return;
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded as User;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token", error });
  }
};
