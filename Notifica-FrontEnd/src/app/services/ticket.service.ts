import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { MockService } from './mock.service';

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
    private http: HttpClient,
    private configService: ConfigService,
    private mockService: MockService
  ) {
    this.apiUrl = `${this.configService.getApiUrl()}/tickets`;
  }

  criarTicket(ticket: Ticket): Observable<any> {
    return this.http.post(this.apiUrl, ticket).pipe(
      catchError(error => {
        console.warn('Backend indisponível, usando mock:', error);
        return this.mockService.criarTicket(ticket);
      })
    );
  }

  obterTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  obterTicketsPorStatus(status: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/status/${status}`).pipe(
      catchError(error => {
        console.warn('Backend indisponível para status', status, '- erro:', error.status, error.message);
        console.warn('Usando mock service como fallback');
        return this.mockService.obterTickets();
      })
    );
  }
}