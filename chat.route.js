const express = require('express');
const router = express.Router();
const pool = require('../db/connections.js');

// 1. ROTA PARA ENVIAR MENSAGEM (POST /chat)
router.post('/chat', async (req, res) => {
    // Pega o telefone do remetente da Query Parameter (?telefone=...)
    const telefoneRemetente = req.query.telefone;
    
    // Pega o destinatário e a mensagem do corpo em JSON
    const { telefone: telefoneDestino, mensagem } = req.body;

    if (!telefoneRemetente || !telefoneDestino || !mensagem) {
        return res.status(400).json({ 
            mensagem: 'Parâmetros ausentes: informe telefone do remetente, destino e a mensagem.' 
        });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO mensagens (telefone_remetente, telefone_destino, mensagem) VALUES (?, ?, ?)',
            [telefoneRemetente, telefoneDestino, mensagem]
        );

        if (result.affectedRows > 0) {
            return res.status(201).json({ 
                mensagem: 'Mensagem enviada com sucesso!',
                id_mensagem: result.insertId
            });
        } else {
            return res.status(400).json({ mensagem: 'Falha ao salvar a mensagem.' });
        }
    } catch (err) {
        console.error('Erro ao enviar mensagem no MySQL:', err);
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
});

// 2. ROTA PARA BUSCAR CONVERSAS / HISTÓRICO (GET /chat)
router.get('/chat', async (req, res) => {
    const { telefoneRemetente, telefoneDestino } = req.query;

    if (!telefoneRemetente || !telefoneDestino) {
        return res.status(400).json({ mensagem: 'Telefones remetente e destino são obrigatórios.' });
    }

    try {
        const [rows] = await pool.query(
            `SELECT * FROM mensagens 
             WHERE (telefone_remetente = ? AND telefone_destino = ?) 
                OR (telefone_remetente = ? AND telefone_destino = ?)
             ORDER BY data_envio ASC`,
            [telefoneRemetente, telefoneDestino, telefoneDestino, telefoneRemetente]
        );

        return res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
        return res.status(500).json({ mensagem: 'Erro ao buscar histórico de mensagens.' });
    }
});

module.exports = router;