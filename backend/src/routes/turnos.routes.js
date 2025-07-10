import { Router } from 'express';
import {  reservarTurnoAnonimo,
          obtenerTurnosDisponibles,
          crearTurnoDisponible,
          generarTurnosAutomaticos,
          actualizarTurno,
          eliminarTurno,
          obtenerHistorialDeTurnos,
          cancelarTurno
        } from '../controllers/turno.controller.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos.js';
import { limiteTurnosAnonimos } from '../middlewares/limiteTurnosAnonimos.js';
import { validarToken } from '../middlewares/validarToken.js';
import { esAdmin } from '../middlewares/esAdmin.js';

const router = Router();

// Usuario no registrado reserva turno
router.post(
  '/anonimo',
  [
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    check('hora', 'La hora es obligatoria').notEmpty(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('telefono', 'El teléfono es obligatorio').notEmpty(),
    validarCampos,
    limiteTurnosAnonimos
  ],
  reservarTurnoAnonimo
);

// Obtener todos los turnos disponibles
router.get('/disponibles', obtenerTurnosDisponibles);

// Admin crea un nuevo turno disponible
router.post(
  '/crear',
  [
    validarToken,
    esAdmin,
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    check('hora', 'La hora es obligatoria').notEmpty(),
    validarCampos
  ],
    crearTurnoDisponible
);

// Admin genera automáticamente los turnos semanales
router.post('/generar-semana', 
  [
    validarToken,
    esAdmin
  ],
  generarTurnosAutomaticos
);

// Admin edita un turno existente
router.put(
  '/:id',
  [
    validarToken,
    esAdmin,
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    check('hora', 'La hora es obligatoria').notEmpty(),
    validarCampos
  ],
  actualizarTurno
);

// Admin elimina un turno
router.delete('/:id', [validarToken, esAdmin], eliminarTurno);

router.get(
  '/historial',
  [validarToken, esAdmin],
  obtenerHistorialDeTurnos
);

router.put('/cancelar/:id', [validarToken, esAdmin], cancelarTurno);

export default router;