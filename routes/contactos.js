// routes/contactos.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Enviar un nuevo mensaje de contacto
router.post('/', async (req, res) => {
    const { nombres, apellidos, correo, telefono, comentarios } = req.body;

    if (!nombres || !apellidos || !correo || !comentarios) {
        return res.status(400).json({
            success: false,
            message: 'Por favor complete los campos obligatorios: Nombres, Apellidos, Correo y Comentarios.'
        });
    }

    try {
        const query = `
            INSERT INTO contactos (nombres, apellidos, correo, telefono, comentarios)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [nombres, apellidos, correo, telefono || null, comentarios]);

        res.status(201).json({
            success: true,
            message: 'Mensaje de contacto guardado con éxito.',
            contactoId: result.insertId
        });
    } catch (error) {
        console.error('Error al guardar mensaje de contacto:', error);
        res.status(500).json({ success: false, message: 'Error interno en el servidor.' });
    }
});

module.exports = router;