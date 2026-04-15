const db = require('../database/db');

// =========================
// GET AGENDA (COM LOGS)
// =========================
exports.getAgenda = async (req, res) => {
  try {
    console.log('🔥 GET /agenda chamado');

    const eventos = await db.query(`
      SELECT * FROM agenda
      WHERE data >= NOW()
      OR (visivel_desde IS NOT NULL AND visivel_desde <= NOW())
    `);

    console.log('📦 eventos do banco:', eventos.rows.length);

    // 🔥 tenta buscar recorrentes (se existir tabela)
    let eventosRecorrentes = [];

    try {
      const recorrentes = await db.query(`
        SELECT * FROM eventos_recorrentes
        WHERE ativo = true
      `);

      console.log('🔁 recorrentes encontrados:', recorrentes.rows.length);

      function gerarRecorrentes(lista) {
        const hoje = new Date();
        const limite = new Date();
        limite.setMonth(limite.getMonth() + 6);

        const eventos = [];

        lista.forEach(r => {
          if (r.tipo === 'semanal') {
            let data = new Date(hoje);

            let diasSemana = [];

            if (Array.isArray(r.dias_semana)) {
              diasSemana = r.dias_semana;
            } else if (typeof r.dias_semana === 'string') {
              diasSemana = r.dias_semana.split(',').map(Number);
            }

            while (data <= limite) {
              if (diasSemana.includes(data.getDay())) {
                const evento = new Date(data);

                if (r.hora) {
                  const [h, m] = r.hora.split(':');
                  evento.setHours(Number(h), Number(m));
                }

                eventos.push({
                  id: `rec_${r.id}_${evento.toISOString()}`,
                  titulo: r.titulo,
                  data: evento,
                  local: r.local,
                  descricao: r.descricao,
                  image_url: r.image_url,
                  is_featured: false
                });
              }

              data.setDate(data.getDate() + 1);
            }
          }
        });

        return eventos;
      }

      eventosRecorrentes = gerarRecorrentes(recorrentes.rows);

      console.log('📅 eventos recorrentes gerados:', eventosRecorrentes.length);

    } catch (err) {
      console.log('⚠️ tabela eventos_recorrentes não encontrada ou erro:', err.message);
    }

    const todos = [
      ...eventos.rows,
      ...eventosRecorrentes
    ];

    todos.sort((a, b) => new Date(a.data) - new Date(b.data));

    console.log('✅ total eventos enviados:', todos.length);

    return res.json(todos);

  } catch (error) {
    console.error('🔥 ERRO REAL GET AGENDA:', error);
    return res.status(500).json({ error: error.message });
  }
};

// =========================
// CREATE EVENTO
// =========================
exports.createAgenda = async (req, res) => {
  try {
    const { titulo, descricao, data } = req.body;

    if (!titulo || !data) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const userId = req.userId;

    const result = await db.query(
      `INSERT INTO agenda (titulo, descricao, data, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titulo, descricao, data, userId]
    );

    console.log('✅ evento criado:', result.rows[0].id);

    return res.json({
      message: 'Evento criado com sucesso',
      evento: result.rows[0]
    });

  } catch (error) {
    console.error('🔥 ERRO CREATE:', error);
    return res.status(500).json({ error: error.message });
  }
};

// =========================
// INTERESSE
// =========================
exports.setInteresse = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    const { interessado } = req.body;

    await db.query(
      `
      INSERT INTO agenda_interacoes (user_id, event_id, interessado)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, event_id)
      DO UPDATE SET interessado = $3
      `,
      [userId, eventId, interessado]
    );

    console.log(`❤️ interesse atualizado: user ${userId} -> evento ${eventId}`);

    return res.status(200).json({ message: 'Interesse atualizado' });

  } catch (err) {
    console.error('🔥 ERRO INTERESSE:', err);
    return res.status(500).json({ error: err.message });
  }
};

// =========================
// PRESENÇA
// =========================
exports.setPresenca = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    const { confirmado } = req.body;

    await db.query(
      `
      INSERT INTO agenda_interacoes (user_id, event_id, confirmado)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, event_id)
      DO UPDATE SET confirmado = $3
      `,
      [userId, eventId, confirmado]
    );

    console.log(`✅ presença: user ${userId} -> evento ${eventId}`);

    return res.status(200).json({ message: 'Presença atualizada' });

  } catch (err) {
    console.error('🔥 ERRO PRESENÇA:', err);
    return res.status(500).json({ error: err.message });
  }
};