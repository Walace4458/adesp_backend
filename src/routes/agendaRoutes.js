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

// 🔥 BUSCAR interações do usuário
router.get('/interacoes', agendaController.getInteracoes);
router.get('/:id/presenca', agendaController.setPresenca);

// 🔥 INTERESSE
router.post('/:id/interesse', agendaController.setInteresse);

// 🔥 PRESENÇA
router.post('/:id/presenca', agendaController.setPresenca);

module.exports = router;