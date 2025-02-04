import express, { Application } from "express";
import dotenv from "dotenv";
import ticketRoutes from "./routes/ticket.routes";
import matchRoutes from "./routes/matches.routes"


dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Montage des routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/matchs", matchRoutes);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});