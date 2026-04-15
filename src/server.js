const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const agendaRoutes = require('./routes/agendaRoutes');

const app = express();

// =========================
// 🔧 CONFIGS
// =========================
app.use(cors({
  origin: '*', // 🔥 libera acesso mobile (depois pode restringir)
}));

app.use(express.json());

// =========================
// 📌 ROTAS
// =========================
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/agenda', agendaRoutes);

// =========================
// 🧪 TESTE
// =========================
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

// =========================
// ❌ ROTA NÃO ENCONTRADA
// =========================
app.use((req, res) => {
  return res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// =========================
// 🚨 ERRO GLOBAL
// =========================
app.use((err, req, res, next) => {
  console.error('🔥 ERRO GLOBAL:', err);

  return res.status(500).json({
    error: 'Erro interno no servidor',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =========================
// 🚀 SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em: http://0.0.0.0:${PORT}`);
});