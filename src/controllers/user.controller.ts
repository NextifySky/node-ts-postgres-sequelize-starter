import { Request, Response } from "express";
import User from "../models/user.model";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,

  auth: {
    user: "sahil.kumar@gmail.com",
    pass: "test@123",
  },
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send verification email
const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  try {
    await transporter.sendMail({
      from: "sahil.kumar@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}. It will expire in 10 minutes.`,
    });
    console.log(`Verification code sent to ${email}: ${verificationCode}`);
  } catch (error) {
    logger.error("Error sending email:", error);
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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email is already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const codeExpiration = new Date();
    codeExpiration.setMinutes(codeExpiration.getMinutes() + 10); // 10-minute expiry

    // Create user with verification code
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      status,
      address,
      verificationCode,
      codeExpiration,
      isVerified: false, // Ensure this field exists in your model
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res
      .status(200)
      .json({ message: "Please verify your email.", userId: user.id });
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

// **2. Email Verification**
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Check if the code matches
    if (user.verificationCode !== verificationCode) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    // Check if the code has expired
    if (user.codeExpiration && new Date() > new Date(user.codeExpiration)) {
      res.status(400).json({ message: "Verification code has expired" });
      return;
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpiration = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    logger.error("Error verifying email:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

// **3. Resend Verification Code**
export const resendVerificationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }
    if (user.isVerified) {
      res.status(400).json({ message: "User is already verified" });
      return;
    }

    const newVerificationCode = generateVerificationCode();
    const newCodeExpiration = new Date();
    newCodeExpiration.setMinutes(newCodeExpiration.getMinutes() + 10);

    user.verificationCode = newVerificationCode;
    user.codeExpiration = newCodeExpiration;
    await user.save();

    await sendVerificationEmail(email, newVerificationCode);

    res.status(200).json({ message: "New verification code sent" });
  } catch (error) {
    logger.error("Error resending verification code:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

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
