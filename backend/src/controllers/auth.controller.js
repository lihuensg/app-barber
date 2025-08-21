import { Usuario } from '../models/usuarios.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

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


// RECUPERACIÓN DE CONTRASEÑA

// enviar email con link de recuperación
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // generar token con vencimiento 15 min
    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // URL de frontend (ajustá con tu dominio real en producción)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    //const resetUrl = `http://localhost:4200/reset-password/${token}`;

    // configurar transporter para enviar mails
    const transporter = nodemailer.createTransport({
      service: "gmail", // podés usar SendGrid, Outlook, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: "Recuperar contraseña",
      html: `
        <p>Hola ${usuario.nombre},</p>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar (válido 15 minutos):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.json({ mensaje: "Se envió un correo para restablecer la contraseña" });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ mensaje: "Error interno", error });
  }
};

// endpoint para resetear la contraseña
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;

    // validar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    // encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.contraseña = await bcrypt.hash(nuevaContrasena, salt);
    await usuario.save();

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ mensaje: "Token inválido o expirado", error });
  }
};