import express from "express";
import turnosRoutes from "./routes/turnos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:4200", 
  credentials: true 
}));

app.use(express.json());

// Rutas
app.use("/api/turnos", turnosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuario", usuarioRoutes);

export default app;
