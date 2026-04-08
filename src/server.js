const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const agendaRoutes = require('./routes/agendaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

//rotas
app.use(userRoutes);
app.use(authRoutes);
app.use(agendaRoutes);

app.get('/', (req, res) =>{
    res.send('API rodando');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});