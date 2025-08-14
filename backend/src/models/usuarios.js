import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'admin'),
    defaultValue: 'cliente'
  },
  foto_perfil: {
    type: DataTypes.STRING,  
    allowNull: true           
  },
  cloudinary_id: {
  type: DataTypes.STRING,
  allowNull: true
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});