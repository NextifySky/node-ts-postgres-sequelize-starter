import fs from "fs";
import path from "path";
import multer from "multer";

// Check if the 'uploads' folder exists, if not, create it
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}${fileExtension}`;
    cb(null, filename);
  },
});

// File filter to only accept images and PDFs
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Only images (jpeg/png) and PDFs are allowed."
      ),
      false
    );
  }
  cb(null, true);
};

// Create the multer instance with storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
