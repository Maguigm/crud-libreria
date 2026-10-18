// Pruebas unitarias del servicio. El repositorio se reemplaza por un "mock"
// para probar la lógica sin conectarse a MySQL.
jest.mock('../src/repositories/librosRepository');
const repo = require('../src/repositories/librosRepository');
const librosService = require('../src/services/librosService');

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {}); // oculta los logs en las pruebas
});

describe('validarLibro', () => {
  test('acepta un libro válido y limpia los espacios', () => {
    const resultado = librosService.validarLibro({ titulo: '  Pedro Páramo ', autor: 'Juan Rulfo' });
    expect(resultado).toEqual({ titulo: 'Pedro Páramo', autor: 'Juan Rulfo', genero: null, anio_publicacion: null });
  });

  test('rechaza un libro sin título con error 400', () => {
    expect(() => librosService.validarLibro({ autor: 'Juan Rulfo' })).toThrow('El título es obligatorio');
  });

  test('rechaza un año mayor al actual', () => {
    expect(() => librosService.validarLibro({ titulo: 'Libro', autor: 'Autor', anio_publicacion: 3000 }))
      .toThrow('El año de publicación');
  });
});

describe('crear', () => {
  const datos = { titulo: 'Pedro Páramo', autor: 'Juan Rulfo' };

  test('genera otro ID si el primero ya existe', async () => {
    repo.contar.mockResolvedValue(3);
    repo.existeId
      .mockResolvedValueOnce(true)   // 1er ID generado: ocupado
      .mockResolvedValueOnce(false); // 2do ID generado: libre
    repo.crear.mockImplementation(async (libro) => libro);

    const libro = await librosService.crear(datos);

    expect(repo.existeId).toHaveBeenCalledTimes(2);
    expect(libro.id).toMatch(/^[A-Z][0-9]{2}$/);
  });

  test('responde 409 cuando ya no hay IDs disponibles (2,600 libros)', async () => {
    repo.contar.mockResolvedValue(2600);
    await expect(librosService.crear(datos)).rejects.toMatchObject({ status: 409 });
    expect(repo.crear).not.toHaveBeenCalled();
  });
});

describe('obtener', () => {
  test('responde 404 si el libro no existe', async () => {
    repo.obtenerPorId.mockResolvedValue(null);
    await expect(librosService.obtener('Z99')).rejects.toMatchObject({ status: 404 });
  });

  test('responde 400 si el ID tiene formato inválido, sin consultar la base de datos', async () => {
    await expect(librosService.obtener('abc')).rejects.toMatchObject({ status: 400 });
    expect(repo.obtenerPorId).not.toHaveBeenCalled();
  });
});