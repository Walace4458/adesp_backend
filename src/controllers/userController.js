const db = require('../database/db');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, senha } = req.body;

        if (!name || !email || !senha) {
            return res.status(400).json({
                error: 'Dados incompletos'
            });
        }
        const senhaHash = await bcrypt.hash(senha, 10);

        const result = await db.query(
            'INSERT INTO users (name, email, senha) VALUES ($1, $2, $3) RETURNING *'
            [name, email, senhaHash]
        );

        res.json({
            message: 'Usuário criado com sucesso',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};