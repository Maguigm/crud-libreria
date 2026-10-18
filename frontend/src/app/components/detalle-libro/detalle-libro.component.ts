import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-detalle-libro',
  imports: [RouterLink, DatePipe],
  templateUrl: './detalle-libro.component.html',
  styleUrl: './detalle-libro.component.css',
})
export class DetalleLibroComponent implements OnInit {
  private libroService = inject(LibroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  libro = signal<Libro | null>(null);
  cargando = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.cargando.set(true);
    this.libroService.obtener(id).subscribe({
      next: (libro) => {
        this.libro.set(libro);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'No se pudo cargar el libro.');
        this.cargando.set(false);
      },
    });
  }

  eliminar(libro: Libro): void {
    const confirmado = confirm(
      `¿Seguro que deseas eliminar "${libro.titulo}" (${libro.id})?\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    this.libroService.eliminar(libro.id).subscribe({
      next: () => {
        this.router.navigate(['/'], { state: { mensaje: `El libro ${libro.id} se eliminó correctamente.` } });
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'No se pudo eliminar el libro.');
      },
    });
  }
}