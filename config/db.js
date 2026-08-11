const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones usando las variables del archivo .env
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_naat_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;