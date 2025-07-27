import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
});

