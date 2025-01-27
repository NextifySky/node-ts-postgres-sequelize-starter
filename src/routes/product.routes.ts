import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  UpdateProduct,
} from "../controllers/product.controller";
import upload from "../middlewares/multer";
import { authenticateJWT } from "../middlewares/authMiddleWare";

const router = Router();

router.get("/products", authenticateJWT, getProducts);
router.post(
  "/products",
  authenticateJWT,
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  createProduct
);

router.delete("/products/:id", authenticateJWT, deleteProduct);
router.get("/products/:id", authenticateJWT, getProductById);

router.patch(
  "/products/:id",
  authenticateJWT,
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  UpdateProduct
);

export default router;
