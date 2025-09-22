// Importações dos componentes das páginas
import { CriacaoTicketsComponent } from './components/criacao-tickets/criacao-tickets.component';
import { HistoricoTicketsComponent } from './components/historico-tickets/historico-tickets.component';
import { LoginComponent } from './components/layout/login/login.component';
import { TicketsAndamentosComponent } from './components/tickets-andamentos/tickets-andamentos.component';
import { TicketsFinalizadosComponent } from './components/tickets-finalizados/tickets-finalizados.component';
import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// Importações dos guards que protegem as rotas
import { adminGuard } from './guards/admin.guard';
import { studentGuard } from './guards/student.guard';
import { staffGuard } from './guards/staff.guard';

// Configuração das rotas do sistema
export const routes: Routes = [
  // Página para criar tickets (só staff pode acessar)
  {
    path: 'criacao-tickets',
    component: CriacaoTicketsComponent,
    canActivate: [staffGuard]
  },

  // Páginas de tickets (só staff pode acessar)
  { path: 'historico', component: HistoricoTicketsComponent, canActivate: [staffGuard] },
  { path: 'andamentos', component: TicketsAndamentosComponent, canActivate: [staffGuard] },
  { path: 'finalizados', component: TicketsFinalizadosComponent, canActivate: [staffGuard] },

  // Rota padrão redireciona para login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Página de login (todos podem acessar)
  { path: 'login', component: LoginComponent },
  // Dashboard do estudante (só estudantes podem acessar)
  { path: 'dashboarddoestudante', component: StudentDashboardComponent, canActivate: [studentGuard] },
  // Dashboard do admin (só admins podem acessar)
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },


];
