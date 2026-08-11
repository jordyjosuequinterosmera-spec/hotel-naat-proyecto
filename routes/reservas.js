// routes/reservas.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint para registrar una nueva reserva
router.post('/', async (req, res) => {
    const { fecha_checkin, adultos, ninos, habitacion_id, usuario_id } = req.body;

    if (!fecha_checkin || !adultos) {
        return res.status(400).json({ 
            success: false, 
            message: 'La fecha de check-in y el número de adultos son obligatorios.' 
        });
    }

    try {
        const roomSelected = habitacion_id || 1;

        const query = `
            INSERT INTO reservas (fecha_checkin, adultos, ninos, habitacion_id, usuario_id, estado)
            VALUES (?, ?, ?, ?, ?, 'confirmada')
        `;

        const [result] = await db.query(query, [
            fecha_checkin, 
            adultos, 
            ninos || 0, 
            roomSelected, 
            usuario_id || null
        ]);

        res.status(201).json({
            success: true,
            message: 'Reserva registrada con éxito en la base de datos.',
            reservaId: result.insertId
        });
    } catch (error) {
        console.error('Error al insertar reserva:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar la reserva en el servidor.' 
        });
    }
});

// Endpoint para listar todas las reservas
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT r.id, r.fecha_checkin, r.adultos, r.ninos, r.estado, h.nombre AS habitacion, u.nombre AS usuario
            FROM reservas r
            LEFT JOIN habitaciones h ON r.habitacion_id = h.id
            LEFT JOIN usuarios u ON r.usuario_id = u.id
            ORDER BY r.creado_en DESC
        `;
        const [rows] = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ success: false, message: 'Error en la base de datos.' });
    }
});

module.exports = router;