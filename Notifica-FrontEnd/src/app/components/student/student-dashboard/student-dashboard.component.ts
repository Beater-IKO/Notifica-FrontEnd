import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { AuthService } from '../../../services/auth.service';
import { TicketService, Ticket as ServiceTicket } from '../../../services/ticket.service';

export interface Ticket {
  id: string;
  title: string;
  sala: string;
  type: string;
  agent: string;
  status: 'open' | 'in-progress' | 'closed';
  description?: string;
  images?: string[];
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MdbRippleModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  currentUser: string;
  selectedTicket: Ticket | null = null;

  tickets: Ticket[] = [];

  menuItems = [
    { label: 'Criar Ticket', icon: 'add', active: false, route: '/criacao-tickets' },
    { label: 'Ticket em andamento', icon: 'pending', active: true, route: '/andamentos' },
    { label: 'Finalizados', icon: 'check_circle', active: false, route: '/finalizados' },
    { label: 'Históricos de tickets', icon: 'history', active: false, route: '/historico' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private ticketService: TicketService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.carregarTicketsDoUsuario();
    this.selectedTicket = null;
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  onMenuItemClick(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;

    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  carregarTicketsDoUsuario(): void {
    this.ticketService.obterTickets().subscribe({
      next: (tickets: ServiceTicket[]) => {
        const userId = this.authService.getUserId();
        const ticketsDoUsuario = tickets.filter(ticket => ticket.user.id === userId);

        this.tickets = ticketsDoUsuario.map(ticket => ({
          id: ticket.id?.toString() || '0',
          title: ticket.problema,
          type: ticket.prioridade,
          sala: ticket.sala,
          agent: 'Sistema',
          status: this.mapearStatus(ticket.status),
          description: ticket.problema
        }));
      },
      error: (error) => {
        console.log('Erro ao carregar tickets:', error);
        this.tickets = [];
      }
    });
  }

  private mapearStatus(status: string): 'open' | 'in-progress' | 'closed' {
    switch (status) {
      case 'INICIADO': return 'in-progress';
      case 'FINALIZADOS': return 'closed';
      default: return 'open';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getTicketStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }
}