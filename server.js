const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// 1. MIDDLEWARES PARA PARSEAR BODY
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. ARCHIVOS ESTÁTICOS
app.use(express.static(__dirname));
// Si los archivos HTML están en la raíz, cambia la línea por:
// app.use(express.static(__dirname));

// 3. RUTAS DE LA API
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

// Manejador genérico para subrutas no encontradas en /api
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'Ruta API no encontrada' });
});

// 4. INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`=================================`);
});