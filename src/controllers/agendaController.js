const db = require('../database/db');

// GET agenda (listar eventos)
exports.getAgenda = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM agenda');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

// POST agenda (criar evento)
exports.createAgenda = async (req, res) => {
    try {
        const { titulo, descricao, data } = req.body;

        if (!titulo || !data) {
            return res.status(400).json({
                error: 'Dados incompletos'
            });
        }

        const userId = req.userId; // 👈 vem do token

        const result = await db.query(
            'INSERT INTO agenda (titulo, descricao, data, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, descricao, data, userId]
        );

        res.json({
            message: 'Evento criado com sucesso',
            evento: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};