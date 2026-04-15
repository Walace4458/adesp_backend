const express = require('express');
const router = express.Router();

const agendaController = require('../controllers/agendaController');
const authMiddleware = require('../middlewares/authMiddleware');

// =========================
// 🔐 PROTEÇÃO GLOBAL
// =========================
router.use(authMiddleware);

// =========================
// 📅 EVENTOS
// =========================

// GET agenda (listar eventos)
router.get('/', agendaController.getAgenda);

// POST agenda (criar evento)
router.post('/', agendaController.createAgenda);

// =========================
// ❤️ INTERAÇÕES
// =========================

// Interesse
router.post('/:id/interesse', agendaController.setInteresse);

// Presença
router.post('/:id/presenca', agendaController.setPresenca);

module.exports = router;