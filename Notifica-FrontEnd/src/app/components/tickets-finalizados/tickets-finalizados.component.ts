import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-finalizados',
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './tickets-finalizados.component.html',
  styleUrl: './tickets-finalizados.component.scss'
})
export class TicketsFinalizadosComponent implements OnInit {
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
        this.tickets = response.filter(ticket => ticket.status === 'FINALIZADOS');
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
