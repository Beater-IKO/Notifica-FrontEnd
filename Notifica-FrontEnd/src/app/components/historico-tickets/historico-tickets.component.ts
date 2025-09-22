import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-historico-tickets',
  imports: [RouterModule, HttpClientModule, CommonModule, HeaderComponent],
  templateUrl: './historico-tickets.component.html',
  styleUrl: './historico-tickets.component.scss'
})
export class HistoricoTicketsComponent implements OnInit {
  router = inject(Router);
  tickets: any[] = [];

  constructor(private http: HttpClient, private userService: UserService) {}

  showTicketModal = false;
  selectedTicket: any = null;

  openTicketModal(ticket: any): void {
    this.selectedTicket = ticket;
    this.showTicketModal = true;
  }

  closeTicketModal(): void {
    this.showTicketModal = false;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'INICIADO': return 'Aberto';
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'FINALIZADOS': return 'Finalizado';
      case 'VISTO': return 'Negado';
      default: return status;
    }
  }

  ngOnInit() {
    this.carregarTickets();
  }

  carregarTickets() {
    this.http.get<any[]>('http://localhost:8080/api/tickets').subscribe({
      next: (response) => {
        // Show all tickets for history
        this.tickets = response;
      },
      error: (error) => {
        console.log('Erro ao carregar tickets:', error);
        this.tickets = [];
      }
    });
  }


}
