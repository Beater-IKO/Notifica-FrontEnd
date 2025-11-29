import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  
  criarTicket(ticket: any): Observable<any> {
    // Simula sucesso após 1 segundo
    return of({ id: Math.floor(Math.random() * 1000), ...ticket }).pipe(delay(1000));
  }

  obterTickets(): Observable<any[]> {
    const mockTickets = [
      { 
        id: 1, 
        problema: 'Ar condicionado não funciona', 
        sala: 'Sala 101', 
        prioridade: 'Alta', 
        status: 'INICIADO',
        user: { id: 1 }
      },
      { 
        id: 2, 
        problema: 'Projetor com defeito', 
        sala: 'Sala 202', 
        prioridade: 'Média', 
        status: 'INICIADO',
        user: { id: 1 }
      },
      { 
        id: 3, 
        problema: 'Computador não liga', 
        sala: 'Lab 301', 
        prioridade: 'Alta', 
        status: 'INICIADO',
        user: { id: 2 }
      },
      { 
        id: 4, 
        problema: 'Quadro branco riscado', 
        sala: 'Sala 105', 
        prioridade: 'Baixa', 
        status: 'INICIADO',
        user: { id: 1 }
      },
      { 
        id: 5, 
        problema: 'Internet lenta', 
        sala: 'Biblioteca', 
        prioridade: 'Média', 
        status: 'INICIADO',
        user: { id: 3 }
      }
    ];
    console.log('MockService: retornando', mockTickets.length, 'tickets');
    return of(mockTickets).pipe(delay(500));
  }
}