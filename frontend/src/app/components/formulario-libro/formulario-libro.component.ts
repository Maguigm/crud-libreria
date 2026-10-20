import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibroService } from '../../services/libro.service';
import { LibroEntrada } from '../../models/libro.model';

@Component({
  selector: 'app-formulario-libro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-libro.component.html',
  styleUrl: './formulario-libro.component.css',
})
export class FormularioLibroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private libroService = inject(LibroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  anioActual = new Date().getFullYear();
  idLibro = signal<string | null>(null); 
  cargando = signal(false);
  guardando = signal(false);
  error = signal('');

  
  formulario = this.fb.group({
    titulo: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    autor: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(150)]],
    genero: ['', [Validators.maxLength(80)]],
    anio_publicacion: [null as number | null, [Validators.min(1), Validators.max(this.anioActual)]],
  });

  get esEdicion(): boolean {
    return this.idLibro() !== null;
  }

  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idLibro.set(id);
      this.cargarLibro(id);
    }
  }

  cargarLibro(id: string): void {
    this.cargando.set(true);
    this.libroService.obtener(id).subscribe({
      next: (libro) => {
        this.formulario.patchValue({
          titulo: libro.titulo,
          autor: libro.autor,
          genero: libro.genero ?? '',
          anio_publicacion: libro.anio_publicacion,
        });
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'No se pudo cargar el libro.');
        this.cargando.set(false);
      },
    });
  }

  
  campoInvalido(nombre: string): boolean {
    const campo = this.formulario.get(nombre);
    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); 
      return;
    }

    const valores = this.formulario.getRawValue();
    const datos: LibroEntrada = {
      titulo: (valores.titulo ?? '').trim(),
      autor: (valores.autor ?? '').trim(),
      genero: valores.genero?.trim() || null,
      anio_publicacion: valores.anio_publicacion ?? null,
    };

    this.guardando.set(true);
    this.error.set('');

    const peticion = this.esEdicion
      ? this.libroService.actualizar(this.idLibro()!, datos)
      : this.libroService.crear(datos);

    peticion.subscribe({
      next: (libro) => {
        const mensaje = this.esEdicion
          ? `El libro ${libro.id} se actualizó correctamente.`
          : `Libro registrado correctamente con el ID ${libro.id}.`;
        this.router.navigate(['/'], { state: { mensaje } });
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'No se pudo guardar el libro.');
        this.guardando.set(false);
      },
    });
  }
}