// Estructura de un libro tal como la devuelve la API
export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  genero: string | null;
  anio_publicacion: number | null;
  created_at?: string;
}

// Datos que se envían para crear o editar (sin id)
export type LibroEntrada = Omit<Libro, 'id' | 'created_at'>;