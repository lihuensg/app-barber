import { Router } from 'express';
import {
  crearPost,
  obtenerPosts,
  obtenerPostPorId,
  eliminarPost,
  darLike,
  quitarLike,
  comentarPost,
  eliminarComentario
} from '../controllers/redSocial.controller.js';

import { validarToken } from '../middlewares/validarToken.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

// Crear un post
router.post('/post', validarToken, upload.single('imagen'), crearPost);

// Obtener todos los posts (con comentarios y likes)
router.get('/posts', obtenerPosts);

// Obtener un post específico por ID
router.get('/post/:id', obtenerPostPorId);

// Eliminar un post (autor o admin)
router.delete('/post/:postId', validarToken, eliminarPost);

// Dar like a un post
router.post('/like/:postId', validarToken, darLike);

// Quitar like de un post
router.delete('/like/:postId', validarToken, quitarLike);

// Comentar un post
router.post('/comentario/:postId', validarToken, comentarPost);

// Eliminar un comentario (autor o admin)
router.delete('/comentario/:comentarioId', validarToken, eliminarComentario);

export default router;
