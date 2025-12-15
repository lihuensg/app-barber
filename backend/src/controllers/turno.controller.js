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
  const [anio, mes, dia] = fechaStr.split("-");
  return `${dia}/${mes}/${anio}`;
}

// ✅ Helpers nuevos (evitan UTC vs local)
function yyyymmddLocal(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDayLocal(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function addDaysLocal(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

// Convierte (fecha DATEONLY + hora TIME) => Date local
function turnoToLocalDateTime(turno) {
  const fecha = typeof turno.fecha === "string" ? turno.fecha : yyyymmddLocal(new Date(turno.fecha));
  const hora = typeof turno.hora === "string" ? turno.hora : String(turno.hora);
  const [Y, M, D] = fecha.split("-").map(Number);

  // hora puede venir "HH:MM:SS" o "HH:MM"
  const [hh, mm, ss] = hora.split(":").map((v) => Number(v || 0));
  return new Date(Y, M - 1, D, hh, mm, ss || 0, 0);
}

export const reservarTurnoAnonimo = async (req, res) => {
  const { fecha, hora, nombre, email, telefono } = req.body;

  const xForwardedFor = req.headers["x-forwarded-for"];
  let ip;

  if (xForwardedFor) {
    ip = xForwardedFor.split(",")[0].trim();
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip || null;
  }

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

    if (email && email.trim() !== "") {
      const fechaArg = formatearFechaArg(fecha);
      await enviarEmailConfirmacion(email, fechaArg, hora);
    }

    const admin = await Usuario.findOne({
      where: { rol: "admin" },
      attributes: ["telefono"],
    });

    if (!admin || !admin.telefono) {
      console.warn("No se encontró teléfono de admin para enviar WhatsApp");
    } else {
      const numeroAdmin = admin.telefono.replace(/\D/g, "");
      const numeroFormateado = `549${numeroAdmin}`;
      const fechaArg = formatearFechaArg(fecha);
      const mensajeWhatsApp = `📅 Nueva reserva: ${nombre}, Fecha: ${fechaArg}, Hora: ${hora}, Mail: ${
        email || "No proporcionado"
      }, Teléfono: ${telefono || "No proporcionado"}`;
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

    turno.estado = "reservado";
    turno.cliente_id = clienteId;
    turno.nombre_manual = cliente.nombre;
    turno.email_manual = cliente.email;
    turno.telefono = cliente.telefono;

    await turno.save();

    const admin = await Usuario.findOne({
      where: { rol: "admin" },
      attributes: ["telefono"],
    });

    if (admin && admin.telefono) {
      const numeroAdmin = admin.telefono.replace(/\D/g, "");
      const numeroFormateado = `549${numeroAdmin}`;
      const fechaArg = formatearFechaArg(fecha);
      const mensajeWhatsApp = `📅 Nueva reserva: ${cliente.nombre}, Fecha: ${fechaArg}, Hora: ${hora}, Teléfono: ${
        cliente.telefono || "No informado"
      }, Email: ${cliente.email || "No informado"}`;
      await enviarMensajeWhatsApp(numeroFormateado, mensajeWhatsApp);
    } else {
      console.warn("No se encontró teléfono de admin para enviar WhatsApp");
    }

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

// ✅ ESTA ES LA QUE ARREGLA TU PROBLEMA (HOY LUNES NO APARECÍA)
export const obtenerHistorialDeTurnos = async (req, res) => {
  try {
    const ahora = new Date();
    const hoy = yyyymmddLocal(ahora);

    const desdeDate = addDaysLocal(startOfDayLocal(ahora), -5);
    const desde = yyyymmddLocal(desdeDate);

    // Traigo todo lo relevante (últimos 5 días a futuro), y luego separo en JS
    const turnos = await Turno.findAll({
      where: {
        // Incluyo reservado y cortado para no “perderlos”
        estado: { [Op.in]: ["reservado", "cortado"] },
        fecha: { [Op.gte]: desde },
      },
      order: [
        ["fecha", "ASC"],
        ["hora", "ASC"],
      ],
    });

    const turnosPasados = [];
    const turnosFuturos = [];

    for (const turno of turnos) {
      const dt = turnoToLocalDateTime(turno);

      if (dt < ahora) {
        turnosPasados.push(turno);
      } else {
        // esto incluye HOY aunque sea el mismo minuto/segundo
        turnosFuturos.push(turno);
      }
    }

    // Si querés seguir marcando como cortado los pasados (opcional)
    await Promise.all(
      turnosPasados.map(async (t) => {
        if (t.estado === "reservado") {
          t.estado = "cortado";
          await t.save();
        }
      })
    );

    // ordeno como vos querías
    turnosPasados.sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : a.hora < b.hora ? 1 : -1));
    turnosFuturos.sort((a, b) => (a.fecha > b.fecha ? 1 : a.fecha < b.fecha ? -1 : a.hora > b.hora ? 1 : -1));

    return res.status(200).json({ turnosPasados, turnosFuturos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el historial de turnos" });
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
