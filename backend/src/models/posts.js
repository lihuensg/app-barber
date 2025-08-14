import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  imagen_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  cloudinary_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

