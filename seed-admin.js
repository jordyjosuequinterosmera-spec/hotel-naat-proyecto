// seed-admin.js
const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function crearAdminInicial() {
    try {
        const usuario = 'admin';
        const passwordPlana = 'admin123'; // Contraseña de ingreso
        const nombre = 'Administrador Principal';

        // Generar Hash seguro de la contraseña
        const passwordHash = await bcrypt.hash(passwordPlana, 10);

        // Insertar o actualizar credenciales en la base de datos
        const query = `
            INSERT INTO administradores (usuario, password_hash, nombre)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
        `;

        await db.query(query, [usuario, passwordHash, nombre]);
        console.log('✅ Administrador creado/actualizado con éxito en la base de datos.');
        console.log(`Credenciales -> Usuario: ${usuario} | Contraseña: ${passwordPlana}`);
        process.exit();
    } catch (error) {
        console.error('❌ Error al crear administrador:', error);
        process.exit(1);
    }
}

crearAdminInicial();