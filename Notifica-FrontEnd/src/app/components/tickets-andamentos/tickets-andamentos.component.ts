import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tickets-andamentos',
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './tickets-andamentos.component.html',
  styleUrl: './tickets-andamentos.component.scss'
})
export class TicketsAndamentosComponent implements OnInit {
  currentUser: string;
  tickets: Ticket[] = [];

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.carregarTickets();
  }

  carregarTickets() {
    this.ticketService.obterTicketsPorStatus('INICIADO').subscribe({
      next: (response) => {
        this.tickets = response;
      },
      error: (error) => {
        console.log('Erro ao carregar tickets:', error);
        this.tickets = [];
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
