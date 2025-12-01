import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';


export interface Ticket {
  id?: number;
  problema: string;
  sala: string;
  prioridade: string;
  status: string;
  user: { id: number };
  categoria?: {
    id: number;
    nome: string;
  };
  mensagens?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.SERVIDOR + '/api/tickets';
  }

  criarTicket(ticket: Ticket): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }

  obterTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  obterTicketsPorStatus(status: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/status/${status}`);
  }

  atualizarStatus(ticketId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/status`, { status });
  }
}