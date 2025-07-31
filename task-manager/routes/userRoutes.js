/**
 * @file userRoutes.js
 * @description Kullanıcı işlemleriyle ilgili endpoint tanımlarını içerir.
 * Bu route yalnızca kimliği doğrulanmış kullanıcılar tarafından erişilebilir.
 * @module routes/userRoutes
 */

const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");

/**
 * @route   GET /users
 * @desc    Sistemdeki tüm kullanıcıları listeler
 * @access  Protected (JWT)
 */
router.get("/users", authenticateToken, getAllUsers);

module.exports = router;
