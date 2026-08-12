const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. POST: Login de Administrador
router.post('/login', async (req, res) => {
    // Resguardo por si req.body llega indefinido
    const { usuario, password } = req.body || {};

    if (!usuario || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Ingrese usuario y contraseña.' 
        });
    }

    try {
        const [rows] = await db.query('SELECT * FROM administradores WHERE usuario = ?', [usuario]);

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuario o contraseña incorrectos.' 
            });
        }

        const admin = rows[0];
        const esValida = await bcrypt.compare(password, admin.password_hash);

        if (!esValida) {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuario o contraseña incorrectos.' 
            });
        }

        res.json({
            success: true,
            message: 'Acceso concedido.',
            admin: { 
                id: admin.id, 
                usuario: admin.usuario, 
                nombre: admin.nombre, 
                rol: admin.rol 
            }
        });
    } catch (error) {
        console.error('Error en login admin:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno en el servidor.',
            error: error.message 
        });
    }
});

// GET: Métricas e información para el Dashboard
router.get('/dashboard-data', async (req, res) => {
    try {
        // Conteo de registros
        let totalReservas = 0, totalEventos = 0, totalContactos = 0;

        try {
            const [[resCount]] = await db.query('SELECT COUNT(*) as total FROM reservas');
            totalReservas = resCount ? resCount.total : 0;
        } catch (e) { console.log('Aviso reservas:', e.message); }

        try {
            const [[evCount]] = await db.query('SELECT COUNT(*) as total FROM eventos');
            totalEventos = evCount ? evCount.total : 0;
        } catch (e) { console.log('Aviso eventos:', e.message); }

        try {
            const [[ctCount]] = await db.query('SELECT COUNT(*) as total FROM contactos');
            totalContactos = ctCount ? ctCount.total : 0;
        } catch (e) { console.log('Aviso contactos:', e.message); }

        // Obtener reservas con JOIN flexible
        let reservas = [];
        try {
            const [rows] = await db.query(`
                SELECT 
                    r.*,
                    COALESCE(u.nombre, 'Huésped Registrar') AS huesped_nombre,
                    COALESCE(u.correo, 'Sin correo') AS huesped_correo,
                    COALESCE(h.nombre, CONCAT('Habitación #', r.habitacion_id)) AS habitacion_nombre
                FROM reservas r
                LEFT JOIN usuarios u ON r.usuario_id = u.id
                LEFT JOIN habitaciones h ON r.habitacion_id = h.id
                ORDER BY r.id DESC
            `);
            reservas = rows;
        } catch (e) {
            console.error('Error al consultar reservas:', e.message);
        }

        // Obtener eventos
        let eventos = [];
        try {
            const [ev] = await db.query('SELECT * FROM eventos ORDER BY id DESC');
            eventos = ev;
        } catch (e) {}

        // Obtener contactos
        let contactos = [];
        try {
            const [ct] = await db.query('SELECT * FROM contactos ORDER BY id DESC');
            contactos = ct;
        } catch (e) {}

        res.json({
            success: true,
            stats: { totalReservas, totalEventos, totalContactos },
            reservas,
            eventos,
            contactos
        });
    } catch (error) {
        console.error('Error general en dashboard-data:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

module.exports = router;