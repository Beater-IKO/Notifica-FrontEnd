import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  login(dados: any): Observable<any> {
    return this.http.post<any>(`${this.configService.getApiUrl()}/auth/login`, dados).pipe(
      tap(response => {
        console.log('Resposta completa do login:', response);
        if (response.token) {
          localStorage.setItem('jwt-token', response.token);
          localStorage.setItem('userName', response.nome || response.usuario || 'Usuário');
          localStorage.setItem('userRole', response.role || 'ESTUDANTE');
          localStorage.setItem('userId', response.id || '1');

          console.log('Dados salvos no localStorage:');
          console.log('Role:', localStorage.getItem('userRole'));
          console.log('Nome:', localStorage.getItem('userName'));

          this.redirectByRole(response.role || 'ESTUDANTE');
        }
      })
    );
  }

  private redirectByRole(role: string): void {
    console.log('Redirecionando usuário com role:', role);
    switch (role) {
      case 'ADMIN':
      case 'GESTOR':
        this.router.navigate(['/admin/usuarios']);
        break;
      case 'ESTUDANTE':
        this.router.navigate(['/student']);
        break;
      case 'PROFESSOR':
      case 'FUNCIONARIO':
        // rota no arquivo de rotas é `tela-de-funcionarios`
        this.router.navigate(['/tela-de-funcionarios']);
        break;
      default:
        this.router.navigate(['/student']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt-token');
  }

  getCurrentUser(): string {
    return localStorage.getItem('userName') || 'Usuário';
  }

  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : 1;
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('jwt-token');
    this.router.navigate(['/login']);
  }
}