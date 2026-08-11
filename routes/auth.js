// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 1. Registro de Usuario
router.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Verificar si el correo ya existe
        const [userExists] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Guardar nuevo usuario
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, passwordHash, 'cliente']
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente.'
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor al registrar usuario.' });
    }
});

// 2. Inicio de Sesión (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña requeridos.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas.' });
        }

        const usuario = rows[0];

        // Comparar contraseña con el hash
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas.' });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
            process.env.JWT_SECRET || 'secreto_super_seguro_naat',
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor al iniciar sesión.' });
    }
});

module.exports = router;