// routes/eventos.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los eventos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM eventos');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al consultar eventos:', error);
        res.status(500).json({ success: false, message: 'Error en la base de datos.' });
    }
});

module.exports = router;