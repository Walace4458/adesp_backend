const express = require('express');
const router = express.Router();

const agendaController = require('../controllers/agendaController');
const verificarToken = require('../middlewares/authMiddleware');

// rotas
router.get('/agenda', agendaController.getAgenda);
router.post('/agenda', verificarToken, agendaController.createAgenda);

module.exports = router;