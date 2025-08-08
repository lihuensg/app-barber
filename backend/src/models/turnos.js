import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Turno = sequelize.define('Turno', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'reservado', 'cortado'),
    defaultValue: 'disponible'
  },
  nombre_manual: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email_manual: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});


