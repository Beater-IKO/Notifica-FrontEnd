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
      { id: 1, problema: 'Ar condicionado não funciona', area: 'Sala 101', prioridade: 'Alta', status: 'INICIADO' },
      { id: 2, problema: 'Projetor com defeito', area: 'Sala 202', prioridade: 'Média', status: 'INICIADO' }
    ];
    return of(mockTickets).pipe(delay(500));
  }
}