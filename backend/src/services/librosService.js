const repo = require('../repositories/librosRepository');
const { generarId, esIdValido } = require('../utils/generadorId');

const MAX_LIBROS = 26 * 100;   // 2,600 combinaciones posibles de ID
const MAX_INTENTOS = 100;
const CAMPOS_BUSQUEDA = ['titulo', 'autor', 'genero'];

// Error con código HTTP (400, 404, 409...) para responder al cliente
class ErrorNegocio extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.name = 'ErrorNegocio';
    this.status = status;
  }
}

function textoLimpio(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

// Valida y limpia los datos de un libro
function validarLibro(datos = {}) {
  const errores = [];
  const titulo = textoLimpio(datos.titulo);
  const autor = textoLimpio(datos.autor);
  const genero = textoLimpio(datos.genero);
  let anio = datos.anio_publicacion;
  const anioActual = new Date().getFullYear();

  if (!titulo) errores.push('El título es obligatorio');
  else if (titulo.length > 200) errores.push('El título no puede exceder 200 caracteres');

  if (!autor) errores.push('El autor es obligatorio');
  else if (autor.length > 150) errores.push('El autor no puede exceder 150 caracteres');

  if (genero.length > 80) errores.push('El género no puede exceder 80 caracteres');

  if (anio === undefined || anio === null || anio === '') {
    anio = null;
  } else {
    anio = Number(anio);
    if (!Number.isInteger(anio) || anio < 1 || anio > anioActual) {
      errores.push(`El año de publicación debe ser un número entre 1 y ${anioActual}`);
    }
  }

  if (errores.length > 0) throw new ErrorNegocio(errores.join('. '), 400);

  return { titulo, autor, genero: genero || null, anio_publicacion: anio };
}

function normalizarId(id) {
  const idNormalizado = String(id || '').trim().toUpperCase();
  if (!esIdValido(idNormalizado)) {
    throw new ErrorNegocio('El ID debe tener el formato letra + 2 dígitos (ej. A12)', 400);
  }
  return idNormalizado;
}

async function listar(q, campo) {
  const texto = textoLimpio(q);
  if (!texto) return repo.obtenerTodos();

  if (campo) {
    if (!CAMPOS_BUSQUEDA.includes(campo)) {
      throw new ErrorNegocio('El campo de búsqueda debe ser titulo, autor o genero', 400);
    }
    return repo.buscarEnCampo(campo, texto);
  }
  return repo.buscarEnTodos(texto);
}

async function obtener(id) {
  const libro = await repo.obtenerPorId(normalizarId(id));
  if (!libro) throw new ErrorNegocio('Libro no encontrado', 404);
  return libro;
}

async function crear(datos) {
  const libro = validarLibro(datos);

  if ((await repo.contar()) >= MAX_LIBROS) {
    throw new ErrorNegocio('No hay IDs disponibles: se alcanzó el máximo de 2,600 libros', 409);
  }

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    const id = generarId();
    if (await repo.existeId(id)) continue; // ID ocupado, se genera otro

    try {
      const creado = await repo.crear({ id, ...libro });
      console.log(`Libro ${id} creado (intento ${intento})`);
      return creado;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') continue; // otra petición tomó el mismo ID
      throw error;
    }
  }

  throw new ErrorNegocio('No se pudo generar un ID disponible, intenta de nuevo', 503);
}

async function actualizar(id, datos) {
  const idValido = normalizarId(id);
  const libro = validarLibro(datos);

  if (!(await repo.existeId(idValido))) throw new ErrorNegocio('Libro no encontrado', 404);

  await repo.actualizar(idValido, libro);
  console.log(`Libro ${idValido} actualizado`);
  return repo.obtenerPorId(idValido);
}

async function eliminar(id) {
  const idValido = normalizarId(id);
  const eliminado = await repo.eliminar(idValido);
  if (!eliminado) throw new ErrorNegocio('Libro no encontrado', 404);
  console.log(`Libro ${idValido} eliminado`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar, validarLibro, ErrorNegocio };