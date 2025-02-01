import { Request, Response, NextFunction } from "express";
import { mintTicket, resellTicket, validateTicket } from "../blockchain/ethereum.service";
import { Ticket } from "../models/ticket.model";

/**
 * Stockage éphémère des tickets
 */
const tickets: Ticket[] = [];

/**
 * Acheter un ticket (Mint)
 */
export async function buyTicketController(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  // Extraction des paramètres depuis le body
  const userAddress: string | undefined = req.body.userAddress;
  const ticketIdRaw: number | string | undefined = req.body.ticketId;
  const priceRaw: number | string | undefined = req.body.price;

  if (!userAddress || ticketIdRaw === undefined || priceRaw === undefined) {
    res.status(400).json({ error: "Paramètres manquants" });
    return;
  }

  // Convertir en number si besoin
  const ticketId: number = Number(ticketIdRaw);
  const price: number = Number(priceRaw);

  try {
    // Appel on-chain (mint)
    const txHash: string = await mintTicket(userAddress, ticketId, price);

    // Stockage local
    const newTicket: Ticket = {
      id: ticketId,
      owner: userAddress,
      price: price,
      resaleCount: 0,
      isUsed: false,
    };
    tickets.push(newTicket);

    res.json({
      success: true,
      message: "Ticket acheté avec succès",
      transactionHash: txHash,
    });
  } catch (error) {
    console.error("Erreur achat ticket :", error);
    res.status(500).json({ error: "Erreur lors de l'achat du ticket" });
  }
}

/**
 * Revendre un ticket
 */
export async function resellTicketController(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  // Extraction des paramètres
  const ticketIdRaw: number | string | undefined = req.body.ticketId;
  const newOwner: string | undefined = req.body.newOwner;
  const newPriceRaw: number | string | undefined = req.body.newPrice;
  const seller: string | undefined = req.body.seller;

  if (!ticketIdRaw || !newOwner || !newPriceRaw || !seller) {
    res.status(400).json({ success: false, message: "Paramètres manquants" });
    return;
  }

  const ticketId: number = Number(ticketIdRaw);
  const newPrice: number = Number(newPriceRaw);

  // Chercher le ticket dans le stockage local
  const ticket: Ticket | undefined = tickets.find((t: Ticket) => t.id === ticketId);
  if (!ticket) {
    res.status(404).json({ success: false, message: "Ticket introuvable" });
    return;
  }

  // Vérifier que le vendeur est bien le propriétaire actuel
  if (ticket.owner.toLowerCase() !== seller.toLowerCase()) {
    res.status(403).json({ success: false, message: "Vous n'êtes pas le propriétaire actuel de ce ticket" });
    return;
  }

  // Vérifier que le ticket n'est pas déjà utilisé
  if (ticket.isUsed) {
    res.status(400).json({ success: false, message: "Ce ticket est déjà utilisé, impossible de le revendre" });
    return;
  }

  // Vérifier le nombre de reventes
  if (ticket.resaleCount >= 2) {
    res.status(400).json({ success: false, message: "Ce ticket a atteint le nombre maximal de reventes" });
    return;
  }

  try {
    const txHash: string = await resellTicket(ticketId, newOwner, newPrice);

    // Mettre à jour le ticket dans le stockage local
    ticket.owner = newOwner;
    ticket.price = newPrice;
    ticket.resaleCount += 1;

    res.json({
      success: true,
      message: "Ticket revendu avec succès",
      transactionHash: txHash,
    });
  } catch (error) {
    console.error("Erreur revente :", error);
    res.status(500).json({ success: false, message: "Erreur lors de la revente du ticket" });
  }
}

/**
 * Valider un ticket (entrée)
 */
export async function validateTicketController(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  // Extraction des paramètres
  const ticketIdRaw: number | string | undefined = req.body.ticketId;

  if (!ticketIdRaw) {
    res.status(400).json({ success: false, message: "ID du ticket manquant" });
    return;
  }

  const ticketId: number = Number(ticketIdRaw);

  // Chercher le ticket
  const ticket: Ticket | undefined = tickets.find((t: Ticket) => t.id === ticketId);
  if (!ticket) {
    res.status(404).json({ success: false, message: "Ticket introuvable" });
    return;
  }

  // Vérifier s'il est déjà utilisé
  if (ticket.isUsed) {
    res.status(400).json({ success: false, message: "Ce ticket est déjà utilisé" });
    return;
  }

  try {
    const txHash: string = await validateTicket(ticketId);

    // Marquer le ticket comme utilisé
    ticket.isUsed = true;

    res.json({
      success: true,
      message: "Ticket validé avec succès",
      transactionHash: txHash,
    });
  } catch (error) {
    console.error("Erreur validation :", error);
    res.status(500).json({ success: false, message: "Erreur lors de la validation du ticket" });
  }
}