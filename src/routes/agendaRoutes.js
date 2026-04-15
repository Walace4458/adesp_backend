const express = require('express');
const router = express.Router();

const agendaController = require('../controllers/agendaController');
const verificarToken = require('../middlewares/authMiddleware');

//====================
//Eventos
//====================

// GET agenda
router.get('/', verificarToken, agendaController.getAgenda);

// POST agenda
router.post('/', verificarToken, agendaController.createAgenda);



//=================
//Interesse
//================

router.post('/:id/interesse', verificarToken, agendaController.setInteresse);

// Presença
router.post('/:id/presenca', verificarToken, agendaController.setPresenca);

module.exports = router;