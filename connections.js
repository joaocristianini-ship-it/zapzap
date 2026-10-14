const mysql = require('mysql2/promise');

const conn = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "whatsapp"
});

module.exports = conn;