import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API: string;

  constructor(
    private http: HttpClient
  ) {
    this.API = environment.SERVIDOR + '/usuarios';
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  save(usuario: Usuario): Observable<Usuario> {
    if (usuario.id) {
      return this.http.put<Usuario>(`${this.API}/update/${usuario.id}`, usuario, this.getHttpOptions());
    } else {
      // Usando endpoint público de registro
      const registerUrl = environment.SERVIDOR + '/auth/register';
      return this.http.post<Usuario>(registerUrl, usuario, this.getHttpOptions());
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
