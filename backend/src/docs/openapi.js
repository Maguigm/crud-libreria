// Especificación OpenAPI 3.0 de la API de la librería
const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador del libro: letra mayúscula A-Z seguida de 2 dígitos',
  schema: { type: 'string', pattern: '^[A-Z][0-9]{2}$', example: 'A12' },
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'API CRUD Librería',
    version: '1.0.0',
    description:
      'API REST para administrar los libros de una biblioteca: alta con identificador generado automáticamente, consulta, búsqueda, edición y eliminación.',
  },
  servers: [{ url: '/', description: 'Servidor actual' }],
  tags: [
    { name: 'Libros', description: 'Operaciones CRUD de libros' },
    { name: 'Salud', description: 'Estado del servicio' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Salud'],
        summary: 'Verifica el estado del servidor y de la base de datos',
        responses: {
          200: {
            description: 'Servidor y base de datos operando',
            content: { 'application/json': { example: { status: 'ok', db: 'conectada' } } },
          },
          503: {
            description: 'Sin conexión a la base de datos',
            content: { 'application/json': { example: { status: 'error', db: 'sin conexión' } } },
          },
        },
      },
    },
    '/api/libros': {
      get: {
        tags: ['Libros'],
        summary: 'Lista o busca libros',
        description:
          'Sin parámetros devuelve todos los libros ordenados por título. Con "q" busca coincidencias parciales (sin distinguir mayúsculas ni acentos) en título, autor y género, o solo en el campo indicado.',
        parameters: [
          { name: 'q', in: 'query', required: false, description: 'Texto a buscar', schema: { type: 'string', example: 'soledad' } },
          { name: 'campo', in: 'query', required: false, description: 'Campo donde buscar', schema: { type: 'string', enum: ['titulo', 'autor', 'genero'] } },
        ],
        responses: {
          200: {
            description: 'Lista de libros',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Libro' } } } },
          },
          400: { $ref: '#/components/responses/ErrorValidacion' },
          500: { $ref: '#/components/responses/ErrorServidor' },
        },
      },
      post: {
        tags: ['Libros'],
        summary: 'Registra un libro nuevo',
        description:
          'El identificador se genera automáticamente (letra A-Z aleatoria + 2 dígitos aleatorios). Si el ID ya existe, se genera otro.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LibroEntrada' } } },
        },
        responses: {
          201: {
            description: 'Libro creado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Libro' } } },
          },
          400: { $ref: '#/components/responses/ErrorValidacion' },
          409: {
            description: 'Se alcanzó el máximo de 2,600 libros (no hay IDs disponibles)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          503: {
            description: 'No se pudo generar un ID disponible',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/api/libros/{id}': {
      get: {
        tags: ['Libros'],
        summary: 'Consulta el detalle de un libro',
        parameters: [idParam],
        responses: {
          200: {
            description: 'Libro encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Libro' } } },
          },
          400: { $ref: '#/components/responses/ErrorFormatoId' },
          404: { $ref: '#/components/responses/NoEncontrado' },
        },
      },
      put: {
        tags: ['Libros'],
        summary: 'Edita un libro existente',
        description: 'Reemplaza los datos del libro. El identificador no se puede modificar.',
        parameters: [idParam],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LibroEntrada' } } },
        },
        responses: {
          200: {
            description: 'Libro actualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Libro' } } },
          },
          400: { $ref: '#/components/responses/ErrorValidacion' },
          404: { $ref: '#/components/responses/NoEncontrado' },
        },
      },
      delete: {
        tags: ['Libros'],
        summary: 'Elimina un libro',
        parameters: [idParam],
        responses: {
          204: { description: 'Libro eliminado (sin contenido)' },
          400: { $ref: '#/components/responses/ErrorFormatoId' },
          404: { $ref: '#/components/responses/NoEncontrado' },
        },
      },
    },
  },
  components: {
    schemas: {
      Libro: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^[A-Z][0-9]{2}$', example: 'B07' },
          titulo: { type: 'string', example: 'Pedro Páramo' },
          autor: { type: 'string', example: 'Juan Rulfo' },
          genero: { type: 'string', nullable: true, example: 'Novela' },
          anio_publicacion: { type: 'integer', nullable: true, example: 1955 },
          created_at: { type: 'string', format: 'date-time', example: '2026-10-17T18:10:15.000Z' },
        },
      },
      LibroEntrada: {
        type: 'object',
        required: ['titulo', 'autor'],
        properties: {
          titulo: { type: 'string', maxLength: 200, example: 'Como agua para chocolate' },
          autor: { type: 'string', maxLength: 150, example: 'Laura Esquivel' },
          genero: { type: 'string', maxLength: 80, example: 'Novela' },
          anio_publicacion: { type: 'integer', minimum: 1, example: 1989, description: 'Entre 1 y el año actual' },
        },
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'Libro no encontrado' } },
      },
    },
    responses: {
      ErrorValidacion: {
        description: 'Datos inválidos',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'El título es obligatorio' } } },
      },
      ErrorFormatoId: {
        description: 'El ID no tiene el formato letra + 2 dígitos',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'El ID debe tener el formato letra + 2 dígitos (ej. A12)' } } },
      },
      NoEncontrado: {
        description: 'El libro no existe',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Libro no encontrado' } } },
      },
      ErrorServidor: {
        description: 'Error interno del servidor',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Error interno del servidor' } } },
      },
    },
  },
};