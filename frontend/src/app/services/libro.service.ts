import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Libro, LibroEntrada } from '../models/libro.model';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/libros`;

  listar(q?: string, campo?: string): Observable<Libro[]> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (q && campo) params = params.set('campo', campo);
    return this.http.get<Libro[]>(this.url, { params });
  }

  obtener(id: string): Observable<Libro> {
    return this.http.get<Libro>(`${this.url}/${id}`);
  }

  crear(libro: LibroEntrada): Observable<Libro> {
    return this.http.post<Libro>(this.url, libro);
  }

  actualizar(id: string, libro: LibroEntrada): Observable<Libro> {
    return this.http.put<Libro>(`${this.url}/${id}`, libro);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}