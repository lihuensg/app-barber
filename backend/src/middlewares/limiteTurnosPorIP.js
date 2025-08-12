import { Turno } from '../models/turnos.js';

export const limiteTurnosPorIP = async (req, res, next) => {
  const ipCliente = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || null;

  if (!ipCliente) return next(); // si no hay IP, no aplicamos restricción

  const turnos = await Turno.findAll({
    where: {
      ip: ipCliente,
      estado: 'reservado'
    },
    order: [['fecha', 'DESC']]
  });

  if (turnos.length >= 5) { // por ejemplo, máximo 5 reservas por IP
    const fechaUltimoTurno = dayjs(turnos[0].fecha);
    const ahora = dayjs();

    const diferencia = ahora.diff(fechaUltimoTurno, 'hour');

    if (diferencia < 12) { // si el último turno es dentro de las últimas 12 horas
      return res.status(429).json({
        mensaje: 'Demasiadas reservas hechas desde esta IP. Intenta más tarde.'
      });
    }
  }

  next();
};
