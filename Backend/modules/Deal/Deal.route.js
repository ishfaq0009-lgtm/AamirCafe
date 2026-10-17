import express from "express";
import {
  getAllDeals,
  getActiveDeals,
  getHotDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
} from "./Deal.controller.js";

const router = express.Router();

router.get("/AllDeals", getAllDeals);
router.get("/ActiveDeals", getActiveDeals);
router.get("/HotDeals", getHotDeals);
router.get("/OneDeal/:id", getDeal);
router.post("/AddDeal", createDeal);
router.post("/UpdateDeal", updateDeal);
router.post("/DeleteDeal", deleteDeal);

export default router;