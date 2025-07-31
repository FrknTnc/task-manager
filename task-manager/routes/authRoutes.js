/**
 * @file authRoutes.js
 * @description Kullanıcı kimlik doğrulama işlemlerine (register, login) ait endpoint tanımlarını içerir.
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @route   POST /auth/register
 * @desc    Yeni kullanıcı kaydı oluşturur
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Kullanıcı giriş işlemi yapar, JWT token döner
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /auth/protected
 * @desc    Token doğrulama testi (korumalı route örneği)
 * @access  Protected (JWT)
 */
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

module.exports = router;
