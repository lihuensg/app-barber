import { Turno } from '../models/turnos.js';
import { v4 as uuidv4 } from 'uuid';

const horariosManana = ['09:00', '09:40', '10:20', '11:00', '11:40'];
const horariosTarde = ['13:40', '14:20', '15:00', '15:40'];

const generarFechasDeLaSemana = () => {
  const fechas = [];
  const hoy = new Date();
  const diaActual = hoy.getDay(); // 0 = domingo

  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + ((1 - diaActual + 7) % 7));

  for (let i = 0; i < 6; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    fechas.push(fecha.toISOString().slice(0, 10));
  }

  return fechas;
};

export const generarTurnosDeLaSemana = async () => {
  const fechas = generarFechasDeLaSemana();

  for (const fecha of fechas) {
    const horarios = [...horariosManana, ...horariosTarde];

    for (const hora of horarios) {
      const existe = await Turno.findOne({ where: { fecha, hora } });

      if (!existe) {
        await Turno.create({
          id: uuidv4(),
          fecha,
          hora,
          estado: 'disponible'
        });
      }
    }
  }
};