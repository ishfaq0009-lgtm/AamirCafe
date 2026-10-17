import express from "express";
import {
  AddFood,
  AllFood,
  OneFood,
  UpdateFood,
  DeleteFood,
} from "./AddFood.controller.js";
import upload from "../../shared/config/middleware/multer.middeware.js";

const router = express.Router();

router.post("/AddFastFood", upload.single("image"), AddFood);
router.post("/UpdateFood", upload.single("image"), UpdateFood);
router.post("/DeleteFood", DeleteFood);
router.get("/AllFoodApi", AllFood);
router.get("/OneFoodData", OneFood);

export default router;