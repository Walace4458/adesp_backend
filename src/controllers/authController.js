const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(400).json({error: 'Senha incorreta'});
        }

        const token = jwt.sign(
            { id: user.id },
            'segredo_super_secreto',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login realizado com sucesso',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro no login'
        });
    }
};