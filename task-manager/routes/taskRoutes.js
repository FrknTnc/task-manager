/**
 * @file taskRoutes.js
 * @description Görev oluşturma, listeleme, güncelleme, silme ve geçmiş loglarını görüntüleme işlemlerine ait endpoint tanımlarını içerir.
 * Tüm işlemler kimlik doğrulaması gerektirir.
 * @module routes/taskRoutes
 */

const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getTaskLogs
} = require('../controllers/taskController');

const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @route   POST /projects/:projectId/tasks
 * @desc    Belirtilen projeye yeni görev oluşturur
 * @access  Protected (JWT)
 */
router.post('/projects/:projectId/tasks', authenticateToken, createTask);

/**
 * @route   GET /projects/:projectId/tasks
 * @desc    Belirtilen projeye ait görevleri listeler
 * @access  Protected (JWT)
 */
router.get('/projects/:projectId/tasks', authenticateToken, getTasksByProject);

/**
 * @route   PUT /tasks/:id
 * @desc    Görevi günceller
 * @access  Protected (JWT)
 */
router.put('/tasks/:id', authenticateToken, updateTask);

/**
 * @route   DELETE /tasks/:id
 * @desc    Görevi siler
 * @access  Protected (JWT)
 */
router.delete('/tasks/:id', authenticateToken, deleteTask);

/**
 * @route   GET /tasks/:taskId/logs
 * @desc    Belirtilen göreve ait geçmiş değişiklik loglarını getirir
 * @access  Protected (JWT)
 */
router.get('/tasks/:taskId/logs', authenticateToken, getTaskLogs);

module.exports = router;
