import multer from "multer";
import storage from "../cloudinary.config.js";

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;