const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// =========================
// 🔐 AUTH ROUTES
// =========================

// LOGIN
router.post('/login', authController.login);

// REGISTER
router.post('/register', authController.register);

module.exports = router;