import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso';

// Serviço responsável por gerenciar os cursos da faculdade
@Injectable({
  providedIn: 'root'
})
export class CursoService {

  // URL da API do backend para cursos
  private API = 'http://localhost:8080/cursos';

  constructor(private http: HttpClient) { }

  // Salva um curso novo ou atualiza um existente
  save(curso: Curso): Observable<Curso> {
    if (curso.id) {
      // Se tem ID, é uma atualização
      return this.http.put<Curso>(`${this.API}/update/${curso.id}`, curso);
    } else {
      // Se não tem ID, é um curso novo
      return this.http.post<Curso>(`${this.API}/save`, curso);
    }
  }

  // Busca todos os cursos do servidor
  findAll(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.API}/findAll`);
  }

  // Busca um curso específico pelo ID
  findById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.API}/findById/${id}`);
  }

  // Exclui um curso do servidor
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
