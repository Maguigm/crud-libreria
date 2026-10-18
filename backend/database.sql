CREATE DATABASE IF NOT EXISTS libreria
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE libreria;

CREATE TABLE libros (
  id               VARCHAR(3)   NOT NULL,
  titulo           VARCHAR(200) NOT NULL,
  autor            VARCHAR(150) NOT NULL,
  genero           VARCHAR(80),
  anio_publicacion INT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_formato_id CHECK (id REGEXP '^[A-Z][0-9]{2}$')
);

-- Datos de prueba
INSERT INTO libros (id, titulo, autor, genero, anio_publicacion) VALUES
('A12', 'Cien años de soledad', 'Gabriel García Márquez', 'Novela', 1967),
('B07', 'Pedro Páramo', 'Juan Rulfo', 'Novela', 1955),
('M45', 'El laberinto de la soledad', 'Octavio Paz', 'Ensayo', 1950);

SELECT * FROM libros;