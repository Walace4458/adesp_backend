const jwt = require('jsonwebtoken');

const SECRET = 'segredo_super_secreto';

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];

    console.log('🔍 AUTH HEADER:', authHeader);

    // ❌ sem token
    if (!authHeader) {
        return res.status(401).json({
            error: 'Token não fornecido'
        });
    }

    // 🔥 separa Bearer + token
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        console.log('❌ FORMATO INVÁLIDO:', parts);
        return res.status(401).json({
            error: 'Token mal formatado'
        });
    }

    const [scheme, token] = parts;

    // ❌ não é Bearer
    if (!/^Bearer$/i.test(scheme)) {
        console.log('❌ SCHEME INVÁLIDO:', scheme);
        return res.status(401).json({
            error: 'Token mal formatado'
        });
    }

    console.log('🔑 TOKEN RECEBIDO:', token);

    try {
        // 🔥 tenta validar
        const decoded = jwt.verify(token, SECRET);

        console.log('✅ TOKEN DECODIFICADO:', decoded);

        req.userId = decoded.id;

        return next();

    } catch (error) {
        console.log('🚨 ERRO JWT:', error.message);

        return res.status(401).json({
            error: 'Token inválido',
            detalhe: error.message // 🔥 isso ajuda MUITO
        });
    }
};