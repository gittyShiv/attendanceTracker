const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const signToken = (user) =>
  jwt.sign({ sub: user._id, email: user.email, name: user.name, avatar: user.avatar }, jwtSecret, {
    expiresIn: '7d'
  });

const verifyToken = (token) => jwt.verify(token, jwtSecret);

module.exports = { signToken, verifyToken };