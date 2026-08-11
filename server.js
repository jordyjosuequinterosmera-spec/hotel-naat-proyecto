// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const reservasRouter = require('./routes/reservas');
const authRouter = require('./routes/auth'); // <--- NUEVO

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rutas API
app.use('/api/reservas', reservasRouter);
app.use('/api/auth', authRouter); // <--- NUEVO

app.get('/api/habitaciones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM habitaciones');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al consultar habitaciones:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor de base de datos' });
    }
});

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    try {
        await db.query('SELECT 1');
        console.log('Conexión exitosa a la base de datos MySQL');
    } catch (err) {
        console.error('No se pudo conectar a MySQL:', err.message);
    }
});