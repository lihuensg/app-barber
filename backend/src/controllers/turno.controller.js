import { Turno } from "../models/turnos.js";
import { Usuario } from "../models/usuarios.js";
import { enviarEmailConfirmacion } from "../utils/email.js";
import { generarTurnosDeLaSemana } from "../utils/generarTurnos.js";
import { Op } from "sequelize";
import { enviarMensajeWhatsApp } from "../utils/callmebot.js";

// Funciones auxiliares

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

function formatearFechaArg(fechaStr) {
  // fechaStr viene tipo "2025-08-12" (YYYY-MM-DD)
  const [anio, mes, dia] = fechaStr.split('-');
  return `${dia}/${mes}/${anio}`;
}

export const reservarTurnoAnonimo = async (req, res) => {
  const { fecha, hora, nombre, email, telefono } = req.body;

  // Obtener IP del cliente
  const xForwardedFor = req.headers["x-forwarded-for"];
  let ip;

  if (xForwardedFor) {
    // Puede ser una lista de IPs, tomá la primera
    ip = xForwardedFor.split(",")[0].trim();
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip || null;
  }

  // Limpiar prefijo IPv6 ::ffff:
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  try {
    const turno = await Turno.findOne({
      where: { fecha, hora, estado: "disponible" },
    });

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no disponible" });
    }

    turno.estado = "reservado";
    turno.nombre_manual = nombre;
    turno.email_manual = email || null;
    turno.telefono = telefono || null;
    turno.ip = ip;
    await turno.save();

    // Solo enviar el mail si se proporcionó
    if (email && email.trim() !== "") {
      const fechaArg = formatearFechaArg(fecha);

      await enviarEmailConfirmacion(email, fechaArg, hora);
    }

    // Obtener teléfono del admin desde la base
    const admin = await Usuario.findOne({
      where: { rol: "admin" },
      attributes: ["telefono"],
    });

    if (!admin || !admin.telefono) {
      console.warn("No se encontró teléfono de admin para enviar WhatsApp");
    } else {
      const numeroAdmin = admin.telefono.replace(/\D/g, ""); // limpiar caracteres no numéricos
      const numeroFormateado = `549${numeroAdmin}`; // agregá código país si es necesario
      const fechaArg = formatearFechaArg(fecha);
      const mensajeWhatsApp = `📅 Nueva reserva: ${nombre}, Fecha: ${fechaArg}, Hora: ${hora}, Mail: ${
        email || "No proporcionado"
      }, Teléfono: ${telefono || "No proporcionado"}`;
      console.log("Número admin a enviar:", numeroFormateado);
      console.log("Mensaje:", mensajeWhatsApp);
      await enviarMensajeWhatsApp(numeroFormateado, mensajeWhatsApp);
    }

    res.status(201).json({ mensaje: "Turno reservado con éxito", turno });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reservarTurnoCliente = async (req, res) => {
  const { fecha, hora } = req.body;
  const clienteId = req.user.id;

  try {
    const turno = await Turno.findOne({
      where: { fecha, hora, estado: "disponible" },
    });

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no disponible" });
    }

    const cliente = await Usuario.findByPk(clienteId, {
      attributes: ["nombre", "email", "telefono"],
    });

    // Asignar el turno al usuario logueado
    turno.estado = "reservado";
    turno.cliente_id = clienteId;

    // Limpiar campos manuales por si fueron usados antes
    turno.nombre_manual = cliente.nombre;
    turno.email_manual = cliente.email;
    turno.telefono = cliente.telefono;

    await turno.save();

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
      return res.status(400).json({
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
      return res.status(400).json({
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

export const obtenerHistorialDeTurnos = async (req, res) => {
  try {
    const ahora = new Date();
    const cincoDiasAtras = new Date();
    cincoDiasAtras.setDate(ahora.getDate() - 5);

    // Turnos pasados: desde 5 días atrás hasta justo antes de ahora
    const turnosPasados = await Turno.findAll({
      where: {
        estado: "reservado",
        [Op.or]: [
          {
            fecha: {
              [Op.between]: [
                cincoDiasAtras.toISOString().split("T")[0],
                ahora.toISOString().split("T")[0],
              ],
            },
            hora: {
              [Op.lt]: ahora.toTimeString().split(" ")[0],
            },
          },
          {
            fecha: {
              [Op.lt]: ahora.toISOString().split("T")[0],
            },
          },
        ],
      },
      order: [
        ["fecha", "DESC"],
        ["hora", "DESC"],
      ],
    });

    // Actualizar estado de turnos pasados a 'cortado'
    await Promise.all(
      turnosPasados.map(async (turno) => {
        if (turno.estado === "reservado") {
          turno.estado = "cortado";
          await turno.save();
        }
      })
    );

    // Turnos futuros: desde ahora en adelante
    const turnosFuturos = await Turno.findAll({
      where: {
        estado: "reservado",
        [Op.or]: [
          {
            fecha: ahora.toISOString().split("T")[0],
            hora: {
              [Op.gte]: ahora.toTimeString().split(" ")[0],
            },
          },
          {
            fecha: {
              [Op.gt]: ahora.toISOString().split("T")[0],
            },
          },
        ],
      },
      order: [
        ["fecha", "ASC"],
        ["hora", "ASC"],
      ],
    });

    res.status(200).json({ turnosPasados, turnosFuturos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el historial de turnos" });
  }
};

export const cancelarTurno = async (req, res) => {
  const { id } = req.params;

  try {
    const turno = await Turno.findByPk(id);
    if (!turno || turno.estado !== "reservado") {
      return res
        .status(404)
        .json({ mensaje: "Turno no reservado o no encontrado" });
    }

    turno.estado = "disponible";
    turno.nombre_manual = null;
    turno.email_manual = null;
    turno.telefono = null;
    turno.cliente_id = null;
    await turno.save();

    res
      .status(200)
      .json({ mensaje: "Turno cancelado y disponible nuevamente", turno });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelarTurnoCliente = async (req, res) => {
  const { id } = req.params;
  const turno = await Turno.findByPk(id);
  if (!turno || turno.cliente_id !== req.user.id)
    return res.status(403).json({ msg: "No autorizado" });

  turno.estado = "disponible";
  turno.cliente_id = null;
  turno.nombre_manual = turno.email_manual = turno.telefono = null;
  await turno.save();
  res.json({ msg: "Turno cancelado" });
};
