const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            error: 'Token não fornecido'
        });
    }

    try {
        // 🔐 verifica e decodifica o token
        const decoded = jwt.verify(token, 'segredo_super_secreto');

        // 🧠 salva o id do usuário na requisição
        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido'
        });
    }
};