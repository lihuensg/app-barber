import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos.js';

const router = Router();

router.post(
  '/login',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('contraseña', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
  ],
  login
);

export default router;
