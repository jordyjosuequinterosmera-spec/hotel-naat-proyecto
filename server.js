const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir archivos estáticos del frontend

// Rutas de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Hotel NAAT activo' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});