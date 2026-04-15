const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 🔍 validação básica
    if (!email || !senha) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    // 🔍 busca usuário
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];

    // 🔐 valida senha (bcrypt)
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Senha incorreta'
      });
    }

    // 🔥 gera token
    const token = jwt.sign(
      { id: user.id },
      'segredo_super_secreto',
      { expiresIn: '7d' } // 🔥 aumentei pra evitar expirar rápido
    );

    return res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('ERRO LOGIN:', error);

    return res.status(500).json({
      error: 'Erro interno no servidor'
    });
  }
};