import { Usuario } from '../models/usuarios.js';
import { Turno } from '../models/turnos.js';
import { Op } from 'sequelize';
import { parseISO, isBefore } from 'date-fns';

export const miPerfil = async (req, res) => {
  const usuario = await Usuario.findByPk(req.usuario.id, { attributes: { exclude: ['contraseña'] }});
  res.json(usuario);
};

export const actualizarPerfil = async (req, res) => {
  const { nombre, telefono } = req.body;
  const user = await Usuario.findByPk(req.usuario.id);
  user.nombre = nombre || user.nombre;
  user.telefono = telefono || user.telefono;
  await user.save();
  res.json({ msg: 'Perfil actualizado' });
};

export const misTurnos = async (req, res) => {
  const todos = await Turno.findAll({
    where: { cliente_id: req.usuario.id },
    order: [['fecha', 'ASC'], ['hora', 'ASC']]
  });

  const ahora = new Date();
  const futuros = [];
  const pasados = [];

  todos.forEach(t => {
    const fechaHora = parseISO(`${t.fecha}T${t.hora}`);
    (isBefore(fechaHora, ahora) ? pasados : futuros).push(t);
  });

  res.json({ futuros, pasados });
};
