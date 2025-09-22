import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-tickets-andamentos',
  imports: [RouterModule, HttpClientModule, CommonModule, HeaderComponent],
  templateUrl: './tickets-andamentos.component.html',
  styleUrl: './tickets-andamentos.component.scss'
})
export class TicketsAndamentosComponent implements OnInit {
  router = inject(Router);
  tickets: any[] = [];

  constructor(private http: HttpClient, private ticketService: TicketService) {}

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
    return this.ticketService.getStatusLabel(status);
  }

  ngOnInit() {
    this.carregarTickets();
  }

  carregarTickets() {
    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.tickets = response.filter(ticket => ticket.status === 'INICIADO');
      },
      error: (error) => {
        this.tickets = [];
      }
    });
  }
}
