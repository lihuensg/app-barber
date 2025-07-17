import { Router } from 'express';
import {
  crearPost,
  obtenerPosts,
  darLike,
  comentarPost
} from '../controllers/redSocial.controller.js';
import { validarToken } from '../middlewares/validarToken.js';

const router = Router();

// Crear post
router.post('/post', validarToken, crearPost);

// Obtener todos los posts con comentarios y likes
router.get('/posts', obtenerPosts);

// Dar like a un post
router.post('/like/:postId', validarToken, darLike);

// Comentar un post
router.post('/comentario/:postId', validarToken, comentarPost);

export default router;
