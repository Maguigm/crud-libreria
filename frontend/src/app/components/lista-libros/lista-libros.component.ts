import { Component, OnInit, inject, signal } from '@angular/core';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-lista-libros',
  imports: [],
  templateUrl: './lista-libros.component.html',
  styleUrl: './lista-libros.component.css',
})
export class ListaLibrosComponent implements OnInit {
  private libroService = inject(LibroService);

  libros = signal<Libro[]>([]);
  cargando = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.libroService.listar().subscribe({
      next: (data) => {
        this.libros.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el servidor. Intenta más tarde.');
        this.cargando.set(false);
      },
    });
  }
}