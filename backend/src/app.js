import express from "express";
import turnosRoutes from "./routes/turnos.routes.js";

const app = express();

// Rutas
app.use("/api/turnos", turnosRoutes);

export default app;
