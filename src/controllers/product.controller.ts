import { Request, Response } from "express";
import Product from "../models/product.models";
import logger from "../utils/logger";
import path from "path";
import fs from "fs";

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

// Create product

export const createProduct = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    // Check if files are uploaded
    if (
      !req.files ||
      !(req.files as { [fieldname: string]: Express.Multer.File[] })["image"] ||
      !(req.files as { [fieldname: string]: Express.Multer.File[] })["pdf"]
    ) {
      res.status(400).json({ message: "No image or PDF uploaded" });
      return;
    }

    // Extract file information
    const image = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      "image"
    ]?.[0];
    const pdf = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      "pdf"
    ]?.[0];

    if (!image || !pdf) {
      res.status(400).json({ message: "No image or PDF uploaded" });
      return;
    }

    // Construct the URLs for image and PDF
    const imageUrl = `/uploads/${image.filename}`;
    const pdfFile = `/uploads/${pdf.filename}`;

    // Destructure the product data from the request body
    const {
      name,
      description,
      category,
      price,
      stock,
      isAvailable,
      rating,
      color,
    } = req.body;
    const userKey = req.user?.id;

    // Create the product with the uploaded image and PDF URLs
    const result = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      isAvailable,
      imageUrl, // Image URL
      rating,
      pdfFile, // PDF URL
      color,
      userKey,
    });

    // Send response
    res.status(201).json({
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Error creating product:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};
// Get All Products
export const getProducts = async (req: CustomRequest, res: Response) => {
  try {
    const userKey = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    const result = await Product.paginate(Number(page), Number(limit), {
      order: [["id", "DESC"]],
      where: { userKey },
    });

    res.status(200).json({
      message: "Products List retrieved successfully",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error("Error retrieving products:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

// Get Product by ID
export const getProductById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userKey = req.user?.id;

    if (isNaN(Number(id))) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const result = await Product.findOne({ where: { id, userKey } });
    if (!result) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({
      message: "Product retrieved successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Error retrieving product:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

// Delete Product
export const deleteProduct = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userKey = req.user?.id;
    if (!id) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const result = await Product.destroy({ where: { id, userKey } });
    if (!result) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error("Error deleting product:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const UpdateProduct = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userKey = req.user?.id;
    // Find the product by its ID
    const product = await Product.findOne({ where: { id, userKey } });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // If a new image is uploaded, update the image URL
    let imageUrl = product.imageUrl;
    const image = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.["image"]?.[0];
    if (image) {
      imageUrl = `/uploads/${image.filename}`; // New image URL

      // Optionally, delete the old image file if it's being replaced
      const oldImagePath = path.join(__dirname, "uploads", product.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete old image
      }
    }

    // If a new PDF is upload ed, update the PDF URL
    let pdfFile = product.pdfFile;
    const pdf = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      "pdf"
    ]?.[0];
    if (pdf) {
      pdfFile = `/uploads/${pdf.filename}`; // New PDF URL

      // Optionally, delete the old PDF file if it's being replaced
      const oldPdfPath = path.join(__dirname, "uploads", product.pdfFile);
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath); // Delete old PDF
      }
    }

    // Update the product with the new image and PDF URLs (if provided) and other fields
    await product.update({ ...req.body, imageUrl, pdfFile });

    // Fetch the updated product from the database
    const updatedProduct = await Product.findOne({ where: { id } });

    // Return the updated product in the response
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};
