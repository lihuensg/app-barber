import { Turno } from "../models/turnos.js";
import { enviarEmailConfirmacion } from "../utils/email.js";
import { generarTurnosDeLaSemana } from "../utils/generarTurnos.js";
import { Op } from "sequelize";

function sumarMinutos(horaStr, minutos) {
  const [h, m] = horaStr.split(":").map(Number);
  const date = new Date(0, 0, 0, h, m);
  date.setMinutes(date.getMinutes() + minutos);
  return date;
}

function hayConflicto(turnos, horaNueva) {
  const horaNuevaDate = sumarMinutos(horaNueva, 0);
  return turnos.some((t) => {
    const horaExistente = sumarMinutos(t.hora, 0);
    const diff = Math.abs(horaNuevaDate - horaExistente) / 60000;
    return diff < 40;
  });
}

export const reservarTurnoAnonimo = async (req, res) => {
  const { fecha, hora, nombre, email, telefono } = req.body;

  try {
    const turno = await Turno.findOne({
      where: { fecha, hora, estado: "disponible" },
    });

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no disponible" });
    }

    turno.estado = "reservado";
    turno.nombre_manual = nombre;
    turno.email_manual = email;
    turno.telefono = telefono;
    await turno.save();

    await enviarEmailConfirmacion(email, fecha, hora);

    res.status(201).json({ mensaje: "Turno reservado con éxito", turno });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerTurnosDisponibles = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      where: { estado: "disponible" },
      order: [
        ["fecha", "ASC"],
        ["hora", "ASC"],
      ],
    });
    res.status(200).json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearTurnoDisponible = async (req, res) => {
  const { fecha, hora } = req.body;

  try {
    const existentes = await Turno.findAll({ where: { fecha } });
    if (hayConflicto(existentes, hora)) {
      return res
        .status(400)
        .json({
          mensaje: "Conflicto: debe haber al menos 40 minutos entre turnos",
        });
    }

    const yaExiste = await Turno.findOne({ where: { fecha, hora } });
    if (yaExiste) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe un turno en ese horario" });
    }

    const nuevoTurno = await Turno.create({
      fecha,
      hora,
      estado: "disponible",
    });

    res.status(201).json({ mensaje: "Turno creado", turno: nuevoTurno });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generarTurnosAutomaticos = async (req, res) => {
  try {
    await generarTurnosDeLaSemana();
    res.status(200).json({ mensaje: "Turnos generados para la semana" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarTurno = async (req, res) => {
  const { id } = req.params;
  const { fecha, hora } = req.body;

  try {
    const turno = await Turno.findByPk(id);
    if (!turno) return res.status(404).json({ mensaje: "Turno no encontrado" });

    const existentes = await Turno.findAll({
      where: { fecha, id: { [Op.ne]: id } },
    });
    if (hayConflicto(existentes, hora)) {
      return res
        .status(400)
        .json({
          mensaje: "Conflicto: debe haber al menos 40 minutos entre turnos",
        });
    }

    turno.fecha = fecha;
    turno.hora = hora;
    await turno.save();

    res.status(200).json({ mensaje: "Turno actualizado", turno });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarTurno = async (req, res) => {
  const { id } = req.params;

  try {
    const turno = await Turno.findByPk(id);
    if (!turno) return res.status(404).json({ mensaje: "Turno no encontrado" });

    await turno.destroy();
    res.status(200).json({ mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerUltimosTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      order: [['fecha', 'DESC'], ['hora', 'DESC']],
      limit: 15
    });
    res.status(200).json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};