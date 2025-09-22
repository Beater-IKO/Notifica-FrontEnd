import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-tickets-finalizados',
  imports: [RouterModule, HttpClientModule, CommonModule, HeaderComponent],
  templateUrl: './tickets-finalizados.component.html',
  styleUrl: './tickets-finalizados.component.scss'
})
export class TicketsFinalizadosComponent implements OnInit {
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
        this.tickets = response.filter(ticket => ticket.status === 'FINALIZADOS');
      },
      error: (error) => {
        this.tickets = [];
      }
    });
  }
}
