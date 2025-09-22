import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

// Serviço alternativo para gerenciar usuários (similar ao UserService)
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // URL da API do backend para usuários
  private API = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) { }

  // Salva um usuário novo ou atualiza um existente
  save(usuario: Usuario): Observable<Usuario> {
    if (usuario.id) {
      // Se tem ID, é uma atualização
      return this.http.put<Usuario>(`${this.API}/update/${usuario.id}`, usuario);
    } else {
      // Se não tem ID, é um usuário novo
      return this.http.post<Usuario>(`${this.API}/save`, usuario);
    }
  }

  // Busca todos os usuários do servidor
  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}/findAll`);
  }

  // Busca um usuário específico pelo ID
  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/findById/${id}`);
  }

  // Exclui um usuário do servidor
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
