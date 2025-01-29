import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET as string;

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secretKey, { expiresIn: "1d" });
};

export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, secretKey);
  } catch (e) {
    console.error("Token verification failed:", e);
    return "Invalid or expired token";
  }
};
