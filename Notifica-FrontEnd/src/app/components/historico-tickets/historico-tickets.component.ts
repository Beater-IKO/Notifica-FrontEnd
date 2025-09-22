import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historico-tickets',
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './historico-tickets.component.html',
  styleUrl: './historico-tickets.component.scss'
})
export class HistoricoTicketsComponent implements OnInit {
  currentUser = localStorage.getItem('userName') || 'Usuário';
  router = inject(Router);
  tickets: any[] = [];

  constructor(private http: HttpClient) {}

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

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
