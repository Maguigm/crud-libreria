import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-lista-libros',
  imports: [FormsModule, RouterLink],
  templateUrl: './lista-libros.component.html',
  styleUrl: './lista-libros.component.css',
})
export class ListaLibrosComponent implements OnInit {
  private libroService = inject(LibroService);

  libros = signal<Libro[]>([]);
  cargando = signal(false);
  errorCarga = signal('');
  error = signal('');
  mensaje = signal('');
  busquedaActiva = signal(false);

  
  texto = '';
  campo = '';

  ngOnInit(): void {
    
    const mensaje = history.state?.mensaje;
    if (mensaje) this.mensaje.set(mensaje);
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.errorCarga.set('');
    this.libroService.listar(this.texto.trim(), this.campo).subscribe({
      next: (data) => {
        this.libros.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.errorCarga.set('No se pudo conectar con el servidor. Intenta más tarde.');
        this.cargando.set(false);
      },
    });
  }

  buscar(): void {
    this.mensaje.set('');
    this.error.set('');
    this.busquedaActiva.set(this.texto.trim() !== '');
    this.cargar();
  }

  limpiar(): void {
    this.texto = '';
    this.campo = '';
    this.busquedaActiva.set(false);
    this.cargar();
  }

  eliminar(libro: Libro): void {
    const confirmado = confirm(
      `¿Seguro que deseas eliminar "${libro.titulo}" (${libro.id})?\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    this.error.set('');
    this.libroService.eliminar(libro.id).subscribe({
      next: () => {
        this.mensaje.set(`El libro ${libro.id} se eliminó correctamente.`);
        this.cargar();
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'No se pudo eliminar el libro.');
      },
    });
  }
}