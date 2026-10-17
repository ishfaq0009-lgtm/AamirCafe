import express from "express";
import {
  getAllPackages,
  getActivePackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} from "./HallPackage.controller.js";

const router = express.Router();

router.get("/AllPackages", getAllPackages);
router.get("/ActivePackages", getActivePackages);
router.get("/OnePackage/:id", getPackage);
router.post("/AddPackage", createPackage);
router.post("/UpdatePackage", updatePackage);
router.post("/DeletePackage", deletePackage);

export default router;