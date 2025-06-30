import nodemailer from 'nodemailer';

export const enviarEmailConfirmacion = async (email, fecha, hora) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: 'NazaBarber <noreply@nazabarber.com>',
    to: email,
    subject: 'Confirmación de turno en NazaBarber',
    html: `<p>¡Hola!<br>Tu turno ha sido reservado para el <strong>${fecha}</strong> a las <strong>${hora}</strong>.<br>Gracias por elegirnos.</p>`
  });
};