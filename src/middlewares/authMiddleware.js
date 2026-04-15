const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // ❌ sem token
  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não fornecido'
    });
  }

  // 🔥 formato: Bearer token
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({
      error: 'Token mal formatado'
    });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      error: 'Token mal formatado'
    });
  }

  try {
    // 🔐 valida token
    const decoded = jwt.verify(token, SECRET);

    // 🔥 injeta dados do usuário
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    return next();

  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }
};