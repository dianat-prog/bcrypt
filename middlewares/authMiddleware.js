const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../crypto/config');


function authenticateToken(req, res, next) {
    const token = req.session.token; // Ahora obtenemos el token desde la sesión
  
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }
  
  
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido', error: err.message });
      }
      req.user = user; // Agregamos el usuario al objeto req para uso posterior
      next(); // Continuamos con el siguiente middleware o controlador
    });
  }

  function generateToken(user) {
      return jwt.sign({ user: user.id }, jwtSecret, { expiresIn: '1h' });
    }
  


  
module.exports = { authenticateToken,generateToken };