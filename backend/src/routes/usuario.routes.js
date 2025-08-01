import { Router } from 'express';
import { miPerfil, actualizarPerfil, misTurnos } from '../controllers/usuario.controller.js';
import { validarToken } from '../middlewares/validarToken.js';
import { uploadPerfil } from '../middlewares/uploadPerfil.js';
import { obtenerDatosHome } from '../controllers/usuario.controller.js';

const router = Router();
router.get('/', validarToken, miPerfil);
router.put('/', validarToken, uploadPerfil.single('foto_perfil'), actualizarPerfil);
router.get('/mis-turnos', validarToken, misTurnos);
router.get('/publico/datos-home', obtenerDatosHome);
export default router;
