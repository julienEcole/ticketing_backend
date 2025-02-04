import express from "express";
import { buyTicket } from "../blockchain/ethereum.service";

const router = express.Router();

router.post("/buy", async (req, res) => {
    try {
        const { matchId, price, buyer } = req.body;
        const txHash = await buyTicket(matchId, price, buyer);
        res.json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

export default router;