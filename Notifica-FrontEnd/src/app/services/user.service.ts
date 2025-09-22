import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Serviço que gerencia as informações do usuário logado
@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private router: Router) { }

  // Pega o nome do usuário que está logado
  getCurrentUser(): string {
    return localStorage.getItem('userName') || 'Usuário';
  }

  // Pega a foto do usuário se ele tiver uma
  getUserPhoto(): string | null {
    return localStorage.getItem('userPhoto');
  }

  // Faz logout removendo todos os dados do usuário e volta para o login
  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userCpf');
    localStorage.removeItem('userTelefone');
    localStorage.removeItem('userPhoto');
    this.router.navigate(['/login']);
  }

  // Pega todas as configurações do usuário salvas no navegador
  getUserSettings() {
    return {
      nome: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
      cpf: localStorage.getItem('userCpf') || '',
      telefone: localStorage.getItem('userTelefone') || '',
      role: localStorage.getItem('userRole') || ''
    };
  }

  // Salva as configurações do usuário no navegador
  saveUserSettings(settings: any, userPhoto?: string): void {
    localStorage.setItem('userName', settings.nome);
    localStorage.setItem('userEmail', settings.email);
    localStorage.setItem('userTelefone', settings.telefone);
    
    // Só admin pode mudar o próprio cargo
    if (this.canEditRole()) {
      localStorage.setItem('userRole', settings.role);
    }
    
    // Salva a foto se o usuário escolheu uma
    if (userPhoto) {
      localStorage.setItem('userPhoto', userPhoto);
    }
  }

  // Verifica se o usuário pode editar cargos (só admin pode)
  canEditRole(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  // Abre as notificações (ainda não foi feito)
  openNotifications(): void {
    alert('Notificações - Funcionalidade em desenvolvimento');
  }
}