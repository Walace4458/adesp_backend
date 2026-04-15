const { Pool } = require('pg');
require('dotenv').config();

// 🔥 cria pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3000,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'app_db',

  // 🔧 configs importantes
  max: 10, // máximo de conexões
  idleTimeoutMillis: 30000, // tempo ocioso antes de fechar conexão
  connectionTimeoutMillis: 5000, // timeout de conexão
});

// 🔍 LOG DE CONEXÃO (debug)
pool.on('connect', () => {
  console.log('🟢 Conectado ao PostgreSQL');
});

// 🚨 LOG DE ERROS
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no PostgreSQL:', err);
});

// 🔥 TESTE DE CONEXÃO INICIAL
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Banco conectado com sucesso');
    client.release();
  } catch (err) {
    console.error('❌ Falha ao conectar no banco:', err.message);
  }
})();

module.exports = pool;