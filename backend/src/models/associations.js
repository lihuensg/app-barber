import { Usuario } from './usuarios.js';
import { Post } from './posts.js';
import { Comentario } from './comentarios.js';
import { Like } from './likes.js';
import { Turno } from './turnos.js';

// Asociación Posts <-> Usuario
Post.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Post, { foreignKey: 'usuario_id' });

// Asociación Comentarios <-> Usuario y Post
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id' });

Comentario.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(Comentario, { foreignKey: 'post_id' });

// Asociación Likes <-> Usuario y Post
Like.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Like, { foreignKey: 'usuario_id' });

Like.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(Like, { foreignKey: 'post_id' });

// Asociación Turnos <-> Usuario
Turno.belongsTo(Usuario, { foreignKey: 'cliente_id', as: 'cliente' });
Usuario.hasMany(Turno, { foreignKey: 'cliente_id', as: 'cliente' });
