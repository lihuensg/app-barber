import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuario } from "./usuarios.js";
import { Post } from "./posts.js";

export const Comentario = sequelize.define("Comentario", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Comentario.belongsTo(Usuario, { foreignKey: "usuario_id" });
Comentario.belongsTo(Post, { foreignKey: "post_id" });
