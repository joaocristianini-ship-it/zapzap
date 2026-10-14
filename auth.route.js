const express = require('express');
const router = express.Router();

// ATENÇÃO AO CAMINHO: '../db/connections.js' (os dois pontos sobem de 'routes' para a raiz)
const pool = require('../db/connections.js');

// Rota POST /auth
router.post('/auth', async (req, res) => {
    const { telefone, senha } = req.query;

    if (!telefone || !senha) {
        return res.status(400).json({ 
            isAuth: false, 
            mensagem: 'Telefone e senha são obrigatórios.' 
        });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM utilizadores WHERE telefone = ? AND senha = ?',
            [telefone, senha]
        );

        if (rows.length > 0) {
            return res.json({ 
                isAuth: true, 
                mensagem: 'Autenticado com sucesso!',
                usuario: rows[0]
            });
        } else {
            return res.status(401).json({ 
                isAuth: false, 
                mensagem: 'Telefone ou senha incorretos.' 
            });
        }
    } catch (err) {
        console.error('Erro no banco de dados:', err);
        return res.status(500).json({ 
            isAuth: false, 
            mensagem: 'Erro interno no servidor.' 
        });
    }
});

module.exports = router;