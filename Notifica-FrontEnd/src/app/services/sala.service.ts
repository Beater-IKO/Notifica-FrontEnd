import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sala } from '../models/sala';

// Serviço responsável por gerenciar as salas da faculdade
@Injectable({
  providedIn: 'root'
})
export class SalaService {

  // URL da API do backend para salas
  private API = 'http://localhost:8080/salas';

  constructor(private http: HttpClient) { }

  // Salva uma sala nova ou atualiza uma existente
  save(sala: Sala): Observable<Sala> {
    if (sala.id) {
      // Se tem ID, é uma atualização
      return this.http.put<Sala>(`${this.API}/update/${sala.id}`, sala);
    } else {
      // Se não tem ID, é uma sala nova
      return this.http.post<Sala>(`${this.API}/save`, sala);
    }
  }

  // Busca todas as salas do servidor
  findAll(): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${this.API}/findAll`);
  }

  // Busca uma sala específica pelo ID
  findById(id: number): Observable<Sala> {
    return this.http.get<Sala>(`${this.API}/findById/${id}`);
  }

  // Exclui uma sala do servidor
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
