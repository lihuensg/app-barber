import app from "./app.js";
import { sequelize } from "./database/database.js";
import dotenv from "dotenv";

// Importar los modelos para que se carguen
import "./models/usuarios.js";
import "./models/posts.js";
import "./models/comentarios.js";
import "./models/likes.js";
import "./models/turnos.js";

// Importar las asociaciones para que se definan
import "./models/associations.js";

dotenv.config();

async function main() {
  try {
    await sequelize.sync({ force: false }); // Cambiar a alter: true para agregar cosas la base de datos sin borrarla
    app.listen(process.env.PORT || 4000);
    console.log("Server is running on port", process.env.PORT || 4000);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
