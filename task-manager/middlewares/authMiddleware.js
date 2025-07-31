/**
 * @file authenticateToken.js
 * @description JWT token'ı doğrulayan middleware'dir. Doğrulama başarılı olursa `req.user` içine kullanıcı bilgilerini ekler.
 * @module middlewares/authenticateToken
 */

const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(new CustomError(401, 'Access token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new CustomError(403, 'Invalid or expired token'));
  }
};

module.exports = authenticateToken;
