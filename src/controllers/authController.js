const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // validação básica
    if (!email || !senha) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    // busca usuário
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

    // valida senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Senha incorreta'
      });
    }

    // gera token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('ERRO LOGIN:', error);

    return res.status(500).json({
      error: 'Erro interno no servidor',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { name, email, senha } = req.body;

    // validação de formato de email
    if (!email.includes('@')) {
      return res.status(400).json({
        error: 'Email inválido'
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        error: 'Senha deve ter no mínimo 6 caracteres'
      });
    }

    // validação correta
    if (!name || !email || !senha) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    // verifica se usuário já existe
    const userExists = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já cadastrado'
      });
    }

    // hash senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // cria usuário
    const result = await db.query(
      `
        INSERT INTO users (name, email, senha)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
      `,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // token opcional (auto login)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user
    });

  } catch (error) {
    console.error('ERRO REGISTER:', error);

    return res.status(500).json({
      error: 'Erro interno no servidor',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};