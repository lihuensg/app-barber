import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Usuario } from './usuarios.js';
import { Post } from './posts.js';

export const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
});

Like.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });