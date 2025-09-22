import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Serviço responsável por gerenciar os tickets do sistema
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  // URL da API do backend para tickets
  private apiUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) { }

  // Busca todos os tickets do servidor
  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Cria um novo ticket enviando para o servidor
  createTicket(ticket: any): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }

  // Atualiza um ticket existente no servidor
  updateTicket(id: string, ticket: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ticket);
  }

  // Converte o status do servidor para texto que o usuário entende
  getStatusLabel(status: string): string {
    switch (status) {
      case 'INICIADO': return 'Aberto';
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'FINALIZADOS': return 'Finalizado';
      case 'VISTO': return 'Negado';
      default: return status;
    }
  }

  // Converte o status do servidor para o formato usado na tela
  mapStatus(status: string): 'open' | 'in-progress' | 'closed' {
    switch(status) {
      case 'INICIADO': return 'open';
      case 'EM_ANDAMENTO': return 'in-progress';
      case 'FINALIZADOS':
      case 'VISTO': return 'closed';
      default: return 'open';
    }
  }
}