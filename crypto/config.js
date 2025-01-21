const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Generar un secreto seguro
const secret = crypto.randomBytes(64).toString('hex'); // Genera una clave aleatoria
const hashedSecret = bcrypt.hashSync(secret, 10); // Hashea la clave para mayor seguridad

const config = {
  jwtSecret: hashedSecret, // Utilizamos el secreto hasheado para JWT
  saltRounds: 10, // Rondas de sal para bcrypt
  hashPassword: (password) => bcrypt.hashSync(password, 10),
  comparePassword: (password, hashedPassword) =>
    bcrypt.compareSync(password, hashedPassword),
};

module.exports = config;