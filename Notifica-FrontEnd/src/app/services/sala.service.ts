import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sala } from '../models/sala';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private API = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.API = `${this.configService.getApiUrl()}/salas`;
  }

  save(sala: Sala): Observable<Sala> {
    if (sala.id) {
      return this.http.put<Sala>(`${this.API}/update/${sala.id}`, sala);
    } else {
      return this.http.post<Sala>(`${this.API}/save`, sala);
    }
  }

  findAll(): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${this.API}/findAll`).pipe(
      catchError(err => {
        console.warn('Erro ao buscar salas no backend:', err);
        // Retorna um fallback vazio para evitar quebrar a UI. Ajuste conforme necessário.
        return of([] as Sala[]);
      })
    );
  }

  findById(id: number): Observable<Sala> {
    return this.http.get<Sala>(`${this.API}/findById/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
