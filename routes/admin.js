// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. POST: Login de Administrador
router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ success: false, message: 'Ingrese usuario y contraseña.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM administradores WHERE usuario = ?', [usuario]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }

        const admin = rows[0];
        const esValida = await bcrypt.compare(password, admin.password_hash);

        if (!esValida) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }

        res.json({
            success: true,
            message: 'Acceso concedido.',
            admin: { id: admin.id, usuario: admin.usuario, nombre: admin.nombre, rol: admin.rol }
        });
    } catch (error) {
        console.error('Error en login admin:', error);
        res.status(500).json({ success: false, message: 'Error interno en el servidor.' });
    }
});

// 2. GET: Métricas e información consolidada para el Dashboard
router.get('/dashboard-data', async (req, res) => {
    try {
        const [[{ totalReservas }]] = await db.query('SELECT COUNT(*) as totalReservas FROM reservas');
        const [[{ totalEventos }]] = await db.query('SELECT COUNT(*) as totalEventos FROM eventos');
        const [[{ totalContactos }]] = await db.query('SELECT COUNT(*) as totalContactos FROM contactos');

        const [reservas] = await db.query('SELECT * FROM reservas ORDER BY creado_en DESC LIMIT 10');
        const [eventos] = await db.query('SELECT * FROM eventos ORDER BY creado_en DESC LIMIT 10');
        const [contactos] = await db.query('SELECT * FROM contactos ORDER BY creado_en DESC LIMIT 10');

        res.json({
            success: true,
            stats: { totalReservas, totalEventos, totalContactos },
            reservas,
            eventos,
            contactos
        });
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        res.status(500).json({ success: false, message: 'Error en la consulta de datos.' });
    }
});

module.exports = router;