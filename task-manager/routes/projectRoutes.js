/**
 * @file projectRoutes.js
 * @description Proje oluşturma, listeleme ve detay görüntüleme işlemlerine ait endpoint tanımlarını içerir.
 * Tüm işlemler kimlik doğrulaması gerektirir.
 * @module routes/projectRoutes
 */

const express = require('express');
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
} = require('../controllers/projectController');

const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @route   POST /projects
 * @desc    Yeni proje oluşturur
 * @access  Protected (JWT)
 */
router.post('/', authenticateToken, createProject);

/**
 * @route   GET /projects
 * @desc    Kullanıcıya ait projeleri listeler
 * @access  Protected (JWT)
 */
router.get('/', authenticateToken, getProjects);

/**
 * @route   GET /projects/:id
 * @desc    Belirli bir projenin detaylarını getirir
 * @access  Protected (JWT)
 */
router.get('/:id', authenticateToken, getProjectById);

module.exports = router;
