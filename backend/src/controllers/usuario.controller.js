import { Usuario } from '../models/usuarios.js';
import { Turno } from '../models/turnos.js';
import { Op } from 'sequelize';
import { parseISO, isBefore } from 'date-fns';

export const miPerfil = async (req, res) => {
  const usuario = await Usuario.findByPk(req.user.id, { attributes: { exclude: ['contraseña'] }});
  res.json(usuario);
};

export const obtenerDatosHome = async (req, res) => {
  try {
    const admin = await Usuario.findOne({
      where: { rol: 'admin' },
      attributes: ['instagram', 'telefono']
    });

    if (!admin) {
      return res.status(404).json({ mensaje: 'Admin no encontrado' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error al obtener datos para home:', error);
    res.status(500).json({ mensaje: 'Error interno', error });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, email, telefono, instagram } = req.body;
    const user = await Usuario.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (req.file) {
      user.foto_perfil = req.file ? req.file.filename : user.foto_perfil;
    }

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.telefono = telefono || user.telefono;
    user.instagram = instagram || user.instagram;

    await user.save();

    res.json({ msg: 'Perfil actualizado correctamente', usuario: user });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil', error });
  }
};


export const misTurnos = async (req, res) => {
  const todos = await Turno.findAll({
    where: { cliente_id: req.user.id },
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


