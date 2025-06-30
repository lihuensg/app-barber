import { Turno } from '../models/turnos.js';

export const limiteTurnosAnonimos = async (req, res, next) => {
  const { email } = req.body;

  const turnosActivos = await Turno.count({
    where: {
      email_manual: email,
      estado: 'reservado'
    }
  });

  if (turnosActivos >= 3) {
    return res.status(429).json({ mensaje: 'Ya tienes 3 turnos activos. Registrate para más.' });
  }

  next();
};
