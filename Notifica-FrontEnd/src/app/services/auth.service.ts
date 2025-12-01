import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  login(dados: any): Observable<any> {
    return this.http.post<any>(environment.SERVIDOR + '/auth/login', dados).pipe(
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
    console.log('=== REDIRECIONAMENTO ===');
    console.log('Role recebido:', role);
    console.log('Tipo do role:', typeof role);

    switch (role) {
      case 'ADMIN':
        console.log('Redirecionando para ADMIN: /admin-dashboard');
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard']);
        }, 100);
        break;
      case 'GESTOR':
        console.log('Redirecionando para GESTOR: /admin-dashboard');
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'ESTUDANTE':
        console.log('Redirecionando para ESTUDANTE: /student');
        this.router.navigate(['/student']);
        break;
      case 'PROFESSOR':
        console.log('Redirecionando para PROFESSOR: /tela-de-funcionarios');
        this.router.navigate(['/tela-de-funcionarios']);
        break;
      case 'FUNCIONARIO':
        console.log('Redirecionando para FUNCIONARIO: /tela-de-funcionarios');
        this.router.navigate(['/tela-de-funcionarios']);
        break;
      default:
        console.log('Role não reconhecido, redirecionando para /student. Role:', role);
        this.router.navigate(['/student']);
    }

    console.log('=== FIM REDIRECIONAMENTO ===');
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