import express from "express";
import turnosRoutes from "./routes/turnos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import redSocialRoutes from "./routes/redSocial.routes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "https://nazabarber.netlify.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true); // para Postman o apps sin origin
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'El CORS no está permitido para este origen.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());

// Para leer datos de formularios (como multipart/form-data)
app.use(express.urlencoded({ extended: true }));

// Para servir archivos estáticos (como imágenes subidas)
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/turnos", turnosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/redsocial", redSocialRoutes);

export default app;
