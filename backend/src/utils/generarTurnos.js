import { Turno } from '../models/turnos.js';
import { v4 as uuidv4 } from 'uuid';

const horariosManana = ['09:00', '09:40', '10:20', '11:00', '11:40'];
const horariosTarde = ['13:40', '14:20', '15:00', '15:40'];

const esDiaHabil = (fecha) => {
  const dia = fecha.getDay();
  return dia >= 1 && dia <= 6; // Lunes a Sábado (domingo excluido)
};

const obtenerSiguientesDiasHabiles = () => {
  const fechas = [];
  let fecha = new Date();

  // Continuar hasta juntar 7 días hábiles
  while (fechas.length < 7) {
    if (esDiaHabil(fecha)) {
      fechas.push(new Date(fecha));
    }
    fecha.setDate(fecha.getDate() + 1);
  }

  console.log("Fechas que se van a generar:", fechas.map(f => f.toISOString().slice(0, 10)));

  return fechas.map(f => f.toISOString().slice(0, 10));
};

export const generarTurnosDeLaSemana = async () => {
  const fechas = obtenerSiguientesDiasHabiles();

  for (const fecha of fechas) {
    const horarios = [...horariosManana, ...horariosTarde];

    for (const hora of horarios) {
      const yaExiste = await Turno.findOne({ where: { fecha, hora } });

      if (!yaExiste) {
        await Turno.create({
          id: uuidv4(),
          fecha,
          hora,
          estado: 'disponible',
          nombre_manual: null,
          email_manual: null,
          telefono: null
        });
      }
    }
  }
};
