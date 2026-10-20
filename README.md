# Sistema CRUD de Librería

Aplicación web para administrar el catálogo de libros de una biblioteca. Permite registrar, listar, buscar, consultar el detalle, editar y eliminar libros. Cada libro recibe un identificador único generado automáticamente con el formato **letra mayúscula + 2 dígitos** (por ejemplo, `A12`).

## Enlaces

| | URL |
|---|---|
| Aplicación web | https://crud-libreria-gamma.vercel.app |
| API REST | https://crud-libreria-api.onrender.com/api/libros |
| Documentación de la API (Swagger) | https://crud-libreria-api.onrender.com/api-docs |

> La API está en un plan gratuito de Render que se suspende tras un periodo sin uso. La primera petición puede tardar cerca de un minuto en responder.

## Tecnologías

| Parte | Tecnología | Publicado en |
|---|---|---|
| Front end | Angular 19 | Vercel |
| Back end | Node.js + Express | Render |
| Base de datos | MySQL 8.4 | Aiven (conexión SSL) |
| Pruebas | Jest, Supertest y Postman | — |

## Funcionalidades

- Registro de libros con ID único generado automáticamente (máximo 2,600 combinaciones).
- Lista de libros con búsqueda por título, autor, género o en todos los campos.
- Detalle de cada libro con su fecha de registro.
- Edición de datos; el ID no se puede modificar.
- Eliminación con confirmación.
- Validación de datos en el front end y en el back end.

## Estructura del proyecto

```
crud-libreria/
├── backend/
│   ├── src/
│   │   ├── routes/          # Endpoints de la API
│   │   ├── services/        # Reglas de negocio y validaciones
│   │   ├── repositories/    # Consultas SQL
│   │   ├── utils/           # Generador de ID
│   │   ├── docs/            # Especificación OpenAPI (Swagger)
│   │   ├── app.js
│   │   ├── db.js
│   │   └── server.js
│   ├── tests/               # Pruebas unitarias y de integración
│   ├── database.sql         # Script de la base de datos
│   └── .env.example
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── components/  # Lista, formulario y detalle
│       │   ├── models/
│       │   └── services/
│       └── environments/
└── docs/
    └── CRUD-Libreria.postman_collection.json
```

## Ejecutar en local

**Requisitos:** Node.js 22, Angular CLI 19 y MySQL 8.

### 1. Base de datos

Ejecutar el script `backend/database.sql` en MySQL. Crea la base `libreria`, la tabla `libros` y tres libros de prueba.

### 2. Back end

```bash
cd backend
npm install
cp .env.example .env    # completar los datos de conexión a MySQL
npm run dev
```

La API queda en `http://localhost:3000` y Swagger en `http://localhost:3000/api-docs`.

### 3. Front end

```bash
cd frontend
npm install
ng serve
```

La aplicación queda en `http://localhost:4200`.

## Variables de entorno (back end)

| Variable | Descripción |
|---|---|
| `DB_HOST` | Servidor de MySQL |
| `DB_PORT` | Puerto de MySQL |
| `DB_USER` | Usuario |
| `DB_PASSWORD` | Contraseña |
| `DB_NAME` | Nombre de la base de datos (`libreria`) |
| `DB_SSL_CA_PATH` | Ruta del certificado SSL (solo en producción) |
| `PORT` | Puerto del servidor (por defecto 3000) |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/libros` | Lista libros. Acepta `q` y `campo` para buscar |
| GET | `/api/libros/{id}` | Detalle de un libro |
| POST | `/api/libros` | Registra un libro |
| PUT | `/api/libros/{id}` | Edita un libro |
| DELETE | `/api/libros/{id}` | Elimina un libro |
| GET | `/api/health` | Estado del servidor y de la base de datos |

## Pruebas

```bash
cd backend
npm test                  # 24 pruebas unitarias y de integración
npm run test:coverage     # reporte de cobertura
```

Las pruebas funcionales de la API están en la colección de Postman `docs/CRUD-Libreria.postman_collection.json`.

## Autora

Margarita Gómez Manrique
