// Pruebas de integración: se prueba la API completa (rutas + servicio + manejo de errores)
// con Supertest. Solo la base de datos se reemplaza por un mock.
jest.mock('../src/repositories/librosRepository');
const request = require('supertest');
const repo = require('../src/repositories/librosRepository');
const app = require('../src/app');

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('GET /api/libros responde 200 con la lista de libros', async () => {
  repo.obtenerTodos.mockResolvedValue([{ id: 'A12', titulo: 'Cien años de soledad' }]);

  const res = await request(app).get('/api/libros');

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test('POST /api/libros responde 201 y devuelve el ID generado', async () => {
  repo.contar.mockResolvedValue(3);
  repo.existeId.mockResolvedValue(false);
  repo.crear.mockImplementation(async (libro) => libro);

  const res = await request(app).post('/api/libros').send({ titulo: 'Pedro Páramo', autor: 'Juan Rulfo' });

  expect(res.status).toBe(201);
  expect(res.body.id).toMatch(/^[A-Z][0-9]{2}$/);
});

test('POST /api/libros sin título responde 400', async () => {
  const res = await request(app).post('/api/libros').send({ autor: 'Juan Rulfo' });

  expect(res.status).toBe(400);
  expect(res.body.error).toContain('El título es obligatorio');
});

test('GET /api/libros/Z99 responde 404 si no existe', async () => {
  repo.obtenerPorId.mockResolvedValue(null);

  const res = await request(app).get('/api/libros/Z99');

  expect(res.status).toBe(404);
  expect(res.body.error).toBe('Libro no encontrado');
});