import express from "express";
import { MatchController } from "../controllers/match.controller";

const router = express.Router();

router.post("/", MatchController.createMatch);
router.get("/", MatchController.getAllMatches);
router.get("/:matchId/seats", MatchController.getRemainingSeats);

export default router;