import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-andamentos',
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './tickets-andamentos.component.html',
  styleUrl: './tickets-andamentos.component.scss'
})
export class TicketsAndamentosComponent implements OnInit {
  tickets: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarTickets();
  }

  carregarTickets() {
    this.http.get<any[]>('http://localhost:8080/api/tickets').subscribe({
      next: (response) => {
        this.tickets = response.filter(ticket => ticket.status === 'ABERTO');
      },
      error: (error) => {
        console.log('Erro ao carregar tickets:', error);
        this.tickets = [];
      }
    });
  }
}
