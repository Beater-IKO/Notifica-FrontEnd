import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private API = environment.SERVIDOR + "/cursos";

  constructor(private http: HttpClient) { }

  save(curso: any): Observable<Curso> {
    if (curso.id) {
      return this.http.put<Curso>(`${this.API}/update/${curso.id}`, curso);
    } else {
      return this.http.post<Curso>(`${this.API}/save`, curso);
    }
  }

  findAll(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.API}/findAll`);
  }

  findById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.API}/findById/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
