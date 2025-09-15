import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sala } from '../models/sala';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private API = 'http://localhost:8080/salas';

  constructor(private http: HttpClient) { }

  save(sala: Sala): Observable<Sala> {
    if (sala.id) {
      return this.http.put<Sala>(`${this.API}/update/${sala.id}`, sala);
    } else {
      return this.http.post<Sala>(`${this.API}/save`, sala);
    }
  }

  findAll(): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${this.API}/findAll`);
  }

  findById(id: number): Observable<Sala> {
    return this.http.get<Sala>(`${this.API}/findById/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
