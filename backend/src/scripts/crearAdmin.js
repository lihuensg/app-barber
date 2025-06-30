import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuarios.js';
import { sequelize } from '../database/database.js';

const crearAdmin = async () => {
  try {
    await sequelize.authenticate(); // Asegura conexión
    await sequelize.sync(); // Solo si no tenés migraciones
    const yaExiste = await Usuario.findOne({ where: { email: 'admin@barber.com' } });
    if (yaExiste) return console.log('⚠️ Admin ya existe');

    const hash = await bcrypt.hash('admin123', 10);

    await Usuario.create({
      nombre: 'Naza',
      email: 'admin@barber.com',
      contraseña: hash,
      telefono: '3447123456',
      rol: 'admin'
    });

    console.log('✅ Admin creado');
  } catch (error) {
    console.error('Error creando admin:', error);
  } finally {
    await sequelize.close(); // Cierra la conexión
  }
};

crearAdmin();