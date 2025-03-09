const express = require('express');
const cors = require('cors');
const connection = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/agendamentos', (req, res) => {
    connection.query('SELECT * FROM agendamentos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const agendamentosFormatados = results.map((agendamento) => ({
            ...agendamento,
            data: agendamento.data.toISOString().split('T')[0],
            horario: agendamento.horario,
        }));

        res.json(agendamentosFormatados);
    });
});

app.post('/agendamentos', (req, res) => {
    const { nome_cliente, servico, data, horario } = req.body;

    const dataHora = `${data}T${horario}:00.000Z`;

    connection.query(
        'INSERT INTO agendamentos (nome_cliente, servico, data, horario) VALUES (?, ?, ?, ?)',
        [nome_cliente, servico, data, horario],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, nome_cliente, servico, data, horario });
        }
    );
});

app.put('/agendamentos/:id', (req, res) => {
    const { id } = req.params;
    const { nome_cliente, servico, data, horario } = req.body;
    connection.query(
        'UPDATE agendamentos SET nome_cliente = ?, servico = ?, data = ?, horario = ? WHERE id = ?',
        [nome_cliente, servico, data, horario, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Agendamento atualizado com sucesso!' });
        }
    );
});

app.delete('/agendamentos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM agendamentos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Agendamento deletado com sucesso!' });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});