import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header.component';
import { TicketService } from '../../../services/ticket.service';

// Interface que define a estrutura de um ticket
export interface Ticket {
  id: string;
  title: string;
  room: string;
  floor: string;
  type: string;
  agent: string;
  status: 'open' | 'in-progress' | 'closed';
  description?: string;
  images?: string[];
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MdbRippleModule, FormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  
  // Dados do estudante logado
  currentUser = localStorage.getItem('userName') || 'Usuário';
  selectedTicket: Ticket | null = null; // Ticket selecionado para ver detalhes
  router = inject(Router);
  
  // Lista dos tickets do estudante
  tickets: Ticket[] = [];

  // Menu do estudante com as opções disponíveis
  menuItems = [
    { label: 'Criar Ticket', icon: 'add', active: false, route: '/criacao-tickets' },
    { label: 'Ticket em andamento', icon: 'pending', active: true, route: null, action: 'andamentos' },
    { label: 'Finalizados', icon: 'check_circle', active: false, route: null, action: 'finalizados' },
    { label: 'Históricos de tickets', icon: 'history', active: false, route: null, action: 'historico' }
  ];

  currentView = 'andamentos'; // Aba atual selecionada
  filteredTickets: Ticket[] = []; // Tickets filtrados para mostrar

  constructor(private http: HttpClient, private ticketService: TicketService) { }

  // Função que executa quando a página carrega
  ngOnInit(): void {
    this.loadTickets(); // Carrega os tickets do servidor
    this.filterTickets(); // Aplica os filtros
  }

  // Seleciona um ticket para ver os detalhes
  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  // Quando clica em um item do menu
  onMenuItemClick(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    
    if (item.route) {
      this.router.navigate([item.route]); // Se tem rota, navega para lá
    } else {
      this.currentView = item.action; // Senão, muda a aba atual
      this.filterTickets();
    }
  }

  showTicketModal = false; // Controla se o modal de ticket está aberto

  // Retorna a classe CSS baseada no status
  getTicketStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }

  // Converte o status para texto em português
  getStatusLabel(status: string): string {
    return this.ticketService.getStatusLabel(status);
  }

  // Abre o modal com os detalhes do ticket
  openTicketModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.showTicketModal = true;
  }

  // Fecha o modal de detalhes do ticket
  closeTicketModal(): void {
    this.showTicketModal = false;
  }

  // Carrega os tickets do servidor
  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (response: any[]) => {
        // Converte os dados do servidor para o formato da tela
        this.tickets = response.map((ticket: any) => ({
          id: ticket.id.toString(),
          title: ticket.problema,
          room: 'Sala XXX', // PENDENTE: pegar sala real do servidor
          floor: '1º Andar', // PENDENTE: pegar andar real do servidor
          type: ticket.area,
          agent: ticket.user?.nome || 'Usuário',
          status: this.mapStatus(ticket.status),
          description: ticket.problema
        }));
        this.filterTickets();
      },
      error: (error: any) => {
        // Se der erro, não faz nada (lista fica vazia)
      }
    });
  }

  // Converte o status do servidor para o formato da tela
  mapStatus(status: string): 'open' | 'in-progress' | 'closed' {
    return this.ticketService.mapStatus(status);
  }

  // Filtra os tickets baseado na aba selecionada
  filterTickets(): void {
    switch(this.currentView) {
      case 'andamentos':
        // Mostra tickets abertos e em andamento
        this.filteredTickets = this.tickets.filter(t => t.status === 'in-progress' || t.status === 'open');
        break;
      case 'finalizados':
        // Mostra apenas tickets finalizados
        this.filteredTickets = this.tickets.filter(t => t.status === 'closed');
        break;
      case 'historico':
        // Mostra todos os tickets
        this.filteredTickets = [...this.tickets];
        break;
      default:
        this.filteredTickets = this.tickets;
    }
  }
}