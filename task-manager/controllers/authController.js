/**
 * @file authController.js
 * @description Kullanıcı kayıt ve giriş işlemlerini yöneten controller fonksiyonlarını içerir.
 * Auth işlemleri servis katmanındaki `authService.js` aracılığıyla gerçekleştirilir.
 * @module controllers/authController
 */

const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Register error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Login error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = { register, login };
