import express, { Router } from "express";
import {
  buyTicketController,
  resellTicketController,
  validateTicketController,
} from "../controllers/ticket.controller";

const router: Router = express.Router();

router.post("/buy", buyTicketController);
router.post("/resell", resellTicketController);
router.post("/validate", validateTicketController);

export default router;