// modelo libro
export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  genero: string | null;
  anio_publicacion: number | null;
  created_at?: string;
}


export type LibroEntrada = Omit<Libro, 'id' | 'created_at'>;