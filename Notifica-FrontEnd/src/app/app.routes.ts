import { CriacaoTicketsComponent } from './components/criacao-tickets/criacao-tickets.component';
import { HistoricoTicketsComponent } from './components/historico-tickets/historico-tickets.component';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { SalasdetailsComponent } from './components/salas/salasdetails/salasdetails.component';
import { SalaslistComponent } from './components/salas/salaslist/salaslist.component';
import { TicketsAndamentosComponent } from './components/tickets-andamentos/tickets-andamentos.component';
import { TicketsFinalizadosComponent } from './components/tickets-finalizados/tickets-finalizados.component';
import { Routes } from '@angular/router';
import { UsuariosdetailsComponent } from './components/usuarios/usuariosdetails/usuariosdetails.component';
import { UsuarioslistComponent } from './components/usuarios/usuarioslist/usuarioslist.component';
import { CursosdetailsComponent } from './components/cursos/cursosdetails/cursosdetails.component';
import { CursoslistComponent } from './components/cursos/cursoslist/cursoslist.component';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';

export const routes: Routes = [  {
    path: 'criacao-tickets',
    component: CriacaoTicketsComponent,
  },

  { path: 'historico', component: HistoricoTicketsComponent },
  { path: 'andamentos', component: TicketsAndamentosComponent },
  { path: 'finalizados', component: TicketsFinalizadosComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboarddoestudante', component: StudentDashboardComponent },

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
];
