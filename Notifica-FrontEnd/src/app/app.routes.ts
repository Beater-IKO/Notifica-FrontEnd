import { TicketsFinalizadosComponent } from './components/tickets-finalizados/tickets-finalizados.component';
import { Routes } from '@angular/router';
import { CriacaoTicketsComponent } from './components/criacao-tickets/criacao-tickets.component';
import { HistoricoTicketsComponent } from './components/historico-tickets/historico-tickets.component';
import { TicketsAndamentosComponent } from './components/tickets-andamentos/tickets-andamentos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'criacao-tickets', pathMatch: 'full' },
  {
    path: 'criacao-tickets',
    component: CriacaoTicketsComponent,
  },

  { path: 'historico', component: HistoricoTicketsComponent },
  { path: 'andamentos', component: TicketsAndamentosComponent },
  { path: 'finalizados', component: TicketsFinalizadosComponent },
];
