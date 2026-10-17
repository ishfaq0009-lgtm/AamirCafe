import express from "express";
import {
  AddDinner,
  AllDinners,
  OneDinner,
  UpdateDinner,
  DeleteDinner,
} from "./Dinner.controller.js";
import upload from "../../shared/config/middleware/multer.middeware.js";

const router = express.Router();

router.post("/AddDinner", upload.single("image"), AddDinner);
router.post("/UpdateDinner", upload.single("image"), UpdateDinner);
router.post("/DeleteDinner", DeleteDinner);
router.get("/AllDinners", AllDinners);
router.get("/OneDinnerData", OneDinner);

export default router;