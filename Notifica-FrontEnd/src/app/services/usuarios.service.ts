import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  private API = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) { }

  save(usuario: Usuario): Observable<Usuario> {
    if (usuario.id) {
      return this.http.put<Usuario>(`${this.API}/update/${usuario.id}`, usuario);
    } else {
      return this.http.post<Usuario>(`${this.API}/save`, usuario);
    }
  }

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}/findAll`);
  }

  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/findById/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
