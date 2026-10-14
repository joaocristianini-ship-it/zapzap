const express = require('express');
const cors = require('cors');

// Importa as rotas
const authRoute = require('./routes/auth.route.js');
const chatRoute = require('./routes/chat.route.js');

const APP = express();

// Middlewares
APP.use(cors()); // Libera o acesso do navegador/interface
APP.use(express.json()); // Permite receber payloads em formato JSON

// Registro das rotas na aplicação
APP.use(authRoute);
APP.use(chatRoute);

const PORT = 3000;
const SERVER = 'localhost';

APP.listen(PORT, () => {
    console.log(`Servidor Online em http://${SERVER}:${PORT}`);
});