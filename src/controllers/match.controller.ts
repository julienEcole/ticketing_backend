import { Request, Response } from "express";
import { createMatch, getAllMatches, getRemainingSeats } from "../blockchain/ethereum.service";
import { Match } from "../models/match.model";

export class MatchController {
    
    /// 🔹 **Créer un match**
    static async createMatch(req: Request, res: Response) {
        try {
            const { title, startTime, totalSeats, tags } = req.body;
    
            if (!title || !startTime || !totalSeats || !Array.isArray(tags)) {
                return res.status(400).json({ success: false, message: "Données invalides" });
            }
    
            const txHash = await createMatch(title, startTime, totalSeats, tags);
            res.json({ success: true, txHash });
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "Une erreur inconnue s'est produite";
            res.status(500).json({ success: false, error: errMsg });
        }
    }
    

    /// 🔹 **Lister tous les matchs**
    static async getAllMatches(req: Request, res: Response) {
        try {
            const matches: Match[] = await getAllMatches();
            res.json(matches);
        } catch (error : unknown) {
            const errMsg = error instanceof Error ? error.message : "Une erreur inconnue s'est produite";
            res.status(500).json({ success: false, error: errMsg });
        }
    }

    /// 🔹 **Voir les places restantes pour un match**
    static async getRemainingSeats(req: Request, res: Response) {
        try {
            const matchId = parseInt(req.params.matchId);
            if (isNaN(matchId)) {
                return res.status(400).json({ success: false, message: "Match ID invalide" });
            }

            const seats = await getRemainingSeats(matchId);
            res.json({ success: true, seats });
        } catch (error : unknown) {
            const errMsg = error instanceof Error ? error.message : "Une erreur inconnue s'est produite";
            res.status(500).json({ success: false, error: errMsg });
        }
    }
}