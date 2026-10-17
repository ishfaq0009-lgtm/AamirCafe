import express from "express";
import { sendMessage } from "./Chat.controller.js";

const router = express.Router();

router.post("/Send", sendMessage);

export default router;