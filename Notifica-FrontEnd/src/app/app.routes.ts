import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { UsuarioslistComponent } from './components/usuarios/usuarioslist/usuarioslist.component';
import { UsuariosdetailsComponent } from './components/usuarios/usuariosdetails/usuariosdetails.component';
import { SalaslistComponent } from './components/salas/salaslist/salaslist.component';
import { SalasdetailsComponent } from './components/salas/salasdetails/salasdetails.component';
import { CursoslistComponent } from './components/cursos/cursoslist/cursoslist.component';
import { CursosdetailsComponent } from './components/cursos/cursosdetails/cursosdetails.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: PrincipalComponent,
    children: [
      { path: 'usuarios', component: UsuarioslistComponent },
      { path: 'usuarios/new', component: UsuariosdetailsComponent },
      { path: 'usuarios/edit/:id', component: UsuariosdetailsComponent },
      { path: 'salas', component: SalaslistComponent },
      { path: 'salas/new', component: SalasdetailsComponent },
      { path: 'salas/edit/:id', component: SalasdetailsComponent },
      { path: 'cursos', component: CursoslistComponent },
      { path: 'cursos/new', component: CursosdetailsComponent },
      { path: 'cursos/edit/:id', component: CursosdetailsComponent }

    ]
  }

]