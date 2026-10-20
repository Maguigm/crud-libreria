const pool = require('../db');



async function obtenerTodos() {
  const [rows] = await pool.query('SELECT * FROM libros ORDER BY titulo');
  return rows;
}

async function buscarEnCampo(campo, texto) {
  
  const [rows] = await pool.query(
    `SELECT * FROM libros WHERE ${campo} LIKE ? ORDER BY titulo`,
    [`%${texto}%`]
  );
  return rows;
}

async function buscarEnTodos(texto) {
  const patron = `%${texto}%`;
  const [rows] = await pool.query(
    'SELECT * FROM libros WHERE titulo LIKE ? OR autor LIKE ? OR genero LIKE ? ORDER BY titulo',
    [patron, patron, patron]
  );
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);
  return rows[0] || null;
}

async function existeId(id) {
  const [rows] = await pool.query('SELECT 1 FROM libros WHERE id = ?', [id]);
  return rows.length > 0;
}

async function contar() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM libros');
  return rows[0].total;
}

async function crear(libro) {
  await pool.query(
    'INSERT INTO libros (id, titulo, autor, genero, anio_publicacion) VALUES (?, ?, ?, ?, ?)',
    [libro.id, libro.titulo, libro.autor, libro.genero, libro.anio_publicacion]
  );
  return obtenerPorId(libro.id);
}

async function actualizar(id, datos) {
  await pool.query(
    'UPDATE libros SET titulo = ?, autor = ?, genero = ?, anio_publicacion = ? WHERE id = ?',
    [datos.titulo, datos.autor, datos.genero, datos.anio_publicacion, id]
  );
}

async function eliminar(id) {
  const [resultado] = await pool.query('DELETE FROM libros WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = {
  obtenerTodos, buscarEnCampo, buscarEnTodos, obtenerPorId,
  existeId, contar, crear, actualizar, eliminar,
};