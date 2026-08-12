-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS hotel_naat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_naat_db;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Habitaciones
CREATE TABLE IF NOT EXISTS habitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    capacidad_adultos INT NOT NULL DEFAULT 1,
    capacidad_ninos INT NOT NULL DEFAULT 0,
    precio_noche DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255)
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    habitacion_id INT,
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE,
    adultos INT NOT NULL DEFAULT 1,
    ninos INT DEFAULT 0,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'confirmada',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE CASCADE
);

-- Datos iniciales para pruebas
INSERT INTO habitaciones (nombre, descripcion, capacidad_adultos, capacidad_ninos, precio_noche, imagen_url) VALUES
('Habitación Estándar', 'Cómoda habitación con cama matrimonial y escritorio.', 2, 1, 45.00, 'images/rooms/habitacion-estandar.jpg'),
('Suite Ejecutiva', 'Elegante suite con vista y área de trabajo preferencial.', 2, 0, 75.00, 'images/rooms/suite-ejecutiva.jpg'),
('Suite Familiar con Vista', 'Amplia suite para toda la familia con vista panorámica.', 4, 2, 110.00, 'images/rooms/suite-familiar.jpg');
--tabla eventos
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    capacidad INT,
    precio_estimado DECIMAL(10,2),
    imagen_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO eventos (nombre, descripcion, capacidad, precio_estimado, imagen_url) VALUES
('Bodas y Celebraciones', 'Espacios al aire libre y salones elegantes equipados para crear momentos inolvidables.', 150, 500.00, 'assets/images/boda.jpg'),
('Conferencias y Negocios', 'Salones ejecutivos con equipos audiovisuales, pantalla gigante y servicio de catering profesional.', 80, 300.00, 'assets/images/conferencia.jpg'),
('Eventos Sociales y Cumpleaños', 'Piscina y área de jardín perfectas para reuniones familiares, cumpleaños y fiestas privadas.', 100, 250.00, 'assets/images/fiesta.jpg');


--tabla xontactos
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    comentarios TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);