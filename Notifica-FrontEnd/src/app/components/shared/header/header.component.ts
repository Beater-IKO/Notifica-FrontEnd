import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Componente do cabeçalho que aparece em todas as páginas
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Nome do usuário logado
  currentUser = localStorage.getItem('userName') || 'Usuário';
  // Foto do usuário
  userPhoto: string | null = localStorage.getItem('userPhoto');
  // Controla se o modal de configurações está aberto
  showSettingsModal = false;
  // Dados das configurações do usuário
  userSettings = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    role: ''
  };

  constructor(private router: Router, private http: HttpClient) { }

  // Função que executa quando o componente carrega
  ngOnInit(): void {
    const userId = localStorage.getItem('userId') || '0';
    this.userPhoto = localStorage.getItem(`userPhoto_${userId}`);
  }

  // Faz logout removendo os dados e voltando pro login
  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  // Abre as notificações (ainda não implementado)
  openNotifications(): void {
    alert('Notificações - Funcionalidade em desenvolvimento');
  }

  // Abre o modal de configurações
  openSettings(): void {
    this.loadUserSettings();
    this.showSettingsModal = true;
  }

  // Fecha o modal de configurações
  closeSettings(): void {
    this.showSettingsModal = false;
  }

  // Carrega as configurações salvas do usuário
  loadUserSettings(): void {
    this.userSettings.nome = localStorage.getItem('userName') || '';
    this.userSettings.email = localStorage.getItem('userEmail') || '';
    this.userSettings.cpf = localStorage.getItem('userCpf') || '';
    this.userSettings.telefone = localStorage.getItem('userTelefone') || '';
    this.userSettings.role = localStorage.getItem('userRole') || '';
    
    const userId = localStorage.getItem('userId') || '0';
    this.userPhoto = localStorage.getItem(`userPhoto_${userId}`);
  }

  // Quando o usuário escolhe uma nova foto
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userPhoto = e.target.result; // Converte para base64
      };
      reader.readAsDataURL(file);
    }
  }

  // Salva as configurações do usuário
  saveSettings(): void {
    localStorage.setItem('userName', this.userSettings.nome);
    localStorage.setItem('userEmail', this.userSettings.email);
    localStorage.setItem('userTelefone', this.userSettings.telefone);
    
    // Salva a foto com o ID do usuário
    const userId = localStorage.getItem('userId') || '0';
    if (this.userPhoto) {
      localStorage.setItem(`userPhoto_${userId}`, this.userPhoto);
    }
    
    this.currentUser = this.userSettings.nome;
    alert('Configurações salvas com sucesso!');
    this.closeSettings();
  }

  // Verifica se o usuário pode editar cargos (só admin)
  canEditRole(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }
}