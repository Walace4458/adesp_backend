const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const agendaRoutes = require('./routes/agendaRoutes');

const app = express();

// =========================
// CONFIGS
// =========================
app.use(cors());
app.use(express.json());

// =========================
// ROTAS
// =========================
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/agenda', agendaRoutes);

// =========================
// TESTE
// =========================
app.get('/', (req, res) => {
  res.send('API rodando');
});

// =========================
// SERVER (🔥 CORRIGIDO)
// =========================
const PORT = 3000;

// 🔥 ESSA LINHA É A DIFERENÇA
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em: http://0.0.0.0:${PORT}`);
});