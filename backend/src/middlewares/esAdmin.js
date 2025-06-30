export const esAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Solo el administrador puede realizar esta acción' });
  }
  next();
};

