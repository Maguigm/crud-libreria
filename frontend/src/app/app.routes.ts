import { Routes } from '@angular/router';
import { ListaLibrosComponent } from './components/lista-libros/lista-libros.component';
import { FormularioLibroComponent } from './components/formulario-libro/formulario-libro.component';
import { DetalleLibroComponent } from './components/detalle-libro/detalle-libro.component';

export const routes: Routes = [
  { path: '', component: ListaLibrosComponent },
  { path: 'libros/nuevo', component: FormularioLibroComponent },
  { path: 'libros/:id', component: DetalleLibroComponent },
  { path: 'libros/:id/editar', component: FormularioLibroComponent },
  { path: '**', redirectTo: '' },
];