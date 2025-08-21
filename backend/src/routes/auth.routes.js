import { Router } from 'express';
import { login, registrar} from '../controllers/auth.controller.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos.js';
import { forgotPassword } from '../controllers/auth.controller.js';
import { resetPassword } from '../controllers/auth.controller.js';

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

router.post(
  '/registrar',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail().isLength({min: 6}),
    check('contraseña', 'La contraseña es obligatoria').notEmpty(),
    check('telefono', 'El teléfono es obligatorio').notEmpty(),
    validarCampos
  ],
  registrar
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
