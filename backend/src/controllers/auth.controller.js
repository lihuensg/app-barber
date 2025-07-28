import { Usuario } from '../models/usuarios.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export const registrar = async (req, res) => {
  const { nombre, email, contraseña, telefono } = req.body;
  try {
    const yaExiste = await Usuario.findOne({ where: { email } });
    if (yaExiste) return res.status(400).json({ msg: 'Email ya usado' });

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevo = await Usuario.create({ nombre, email, contraseña: hash, telefono });

    res.status(201).json({ msg: 'Cuenta creada', usuario: { id: nuevo.id, nombre, email } });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const login = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValida) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.status(200).json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};