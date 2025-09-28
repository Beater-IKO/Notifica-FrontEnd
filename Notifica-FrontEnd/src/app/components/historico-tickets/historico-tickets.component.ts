import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-historico-tickets',
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './historico-tickets.component.html',
  styleUrl: './historico-tickets.component.scss'
})
export class HistoricoTicketsComponent implements OnInit {
  currentUser: string;
  router = inject(Router);
  tickets: any[] = [];

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
    this.ticketService.obterTickets().subscribe({
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
