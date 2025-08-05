import { Turno } from '../models/turnos.js';
import dayjs from 'dayjs';

export const limiteTurnosAnonimos = async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(); // Si no hay email, no aplicamos restricción

  const turnos = await Turno.findAll({
    where: {
      email_manual: email,
      estado: 'reservado'
    },
    order: [['fecha', 'DESC']]
  });

  if (turnos.length >= 3) {
    const fechaUltimoTurno = dayjs(turnos[0].fecha); // más reciente
    const ahora = dayjs();

    const diferencia = ahora.diff(fechaUltimoTurno, 'day');

    if (diferencia < 1) {
      return res.status(429).json({
        mensaje: 'Ya tienes 3 turnos activos. Espera 1 día para reservar otro.'
      });
    }
  }

  next();
};
