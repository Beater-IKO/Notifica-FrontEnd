import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header.component';


// Interface que define como é um ticket no sistema
export interface Ticket {
  id: string;
  title: string;
  room: string;
  floor: string;
  type: string;
  agent: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'LEVE' | 'MEDIO' | 'ALTO' | 'URGENTE';
  description?: string;
  images?: string[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MdbRippleModule, FormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  // Dados do usuário logado
  currentUser = localStorage.getItem('userName') || 'Admin';
  userPhoto: string | null = localStorage.getItem('userPhoto');
  selectedTicket: Ticket | null = null;
  router = inject(Router);
  
  // Lista de todos os tickets
  tickets: Ticket[] = [];

  // Menu lateral do admin com todas as opções
  menuItems = [
    { label: 'Verificar tickets', icon: 'search', active: false, route: null, action: 'verificar' },
    { label: 'Tickets em andamento', icon: 'pending', active: false, route: null, action: 'andamentos' },
    { label: 'Finalizados', icon: 'check_circle', active: false, route: null, action: 'finalizados' },
    { label: 'Histórico de tickets', icon: 'history', active: true, route: null, action: 'historico' },
    { label: 'Salas', icon: 'room', active: false, route: null, action: 'salas' },
    { label: 'Gerenciar usuários', icon: 'people', active: false, route: null, action: 'usuarios' }
  ];

  currentView = 'historico';
  filteredTickets: Ticket[] = []; // Tickets filtrados para mostrar na tela
  
  // Opções de filtro para buscar tickets específicos
  selectedSala = '';
  selectedPrioridade = '';
  selectedAndar = '';
  selectedTipo = '';
  
  // Listas com as opções disponíveis no sistema
  salas = ['Sala 101', 'Sala 102', 'Sala 201', 'Sala 202', 'Laboratório 1', 'Laboratório 2'];
  prioridades = ['LEVE', 'MEDIO', 'ALTO', 'URGENTE'];
  andares = ['1º Andar', '2º Andar', '3º Andar', '4º Andar'];
  tipos = ['Ar Condicionado', 'Elétrica', 'Hidráulica', 'Mobiliário'];
  // Gerenciamento de usuários
  users: any[] = [];
  showUserModal = false; // Controla se o modal de usuário está aberto
  selectedUser: any = null; // Usuário selecionado para editar
  userForm = { // Formulário para criar/editar usuário
    nome: '',
    email: '',
    cpf: '',
    usuario: '',
    senha: '',
    role: 'ESTUDANTE'
  };
  
  showTicketModal = false; // Controla se o modal de ticket está aberto

  // Modal de configurações do usuário
  showSettingsModal = false;
  userSettings = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    role: ''
  };

  constructor(private http: HttpClient) { }

  // Função que roda quando a página carrega
  ngOnInit(): void {
    this.userPhoto = localStorage.getItem('userPhoto');
    this.loadTickets(); // Carrega os tickets do servidor
    this.filterTickets(); // Aplica os filtros
  }

  // Busca todos os tickets no servidor
  loadTickets(): void {
    this.http.get<any[]>('http://localhost:8080/api/tickets').subscribe({
      next: (response) => {
        // Converte os dados do servidor para o formato que usamos na tela
        this.tickets = response.map(ticket => ({
          id: ticket.id.toString(),
          title: ticket.problema,
          room: ticket.sala || 'Sala 101',
          floor: ticket.andar || '1º Andar',
          type: ticket.area,
          agent: ticket.user?.nome || 'Usuário',
          status: this.mapStatus(ticket.status),
          priority: ticket.prioridade,
          description: ticket.problema
        }));
        this.filterTickets();
      },
      error: (error) => {
        // Se der erro, deixa a lista vazia
        this.tickets = [];
        this.filterTickets();
      }
    });
  }

  // Converte o status do servidor para o formato da tela
  mapStatus(status: string): 'open' | 'in-progress' | 'closed' {
    switch(status) {
      case 'INICIADO': return 'open';
      case 'EM_ANDAMENTO': return 'in-progress';
      case 'FINALIZADOS': return 'closed';
      case 'VISTO': return 'closed';
      default: return 'open';
    }
  }

  // Filtra os tickets baseado na aba selecionada e nos filtros
  filterTickets(): void {
    let filtered = [...this.tickets];
    
    // Primeiro filtra por status baseado na aba selecionada
    switch(this.currentView) {
      case 'verificar':
        filtered = filtered.filter(t => t.status === 'open');
        break;
      case 'andamentos':
        filtered = filtered.filter(t => t.status === 'in-progress');
        break;
      case 'finalizados':
        filtered = filtered.filter(t => t.status === 'closed');
        break;
      case 'salas':
        // Mostra todos os tickets para visualização por sala
        break;
      case 'historico':
        // Mostra todos os tickets
        break;
    }
    
    // Depois aplica os filtros adicionais
    if (this.selectedSala) {
      filtered = filtered.filter(t => t.room === this.selectedSala);
    }
    if (this.selectedPrioridade) {
      filtered = filtered.filter(t => t.priority === this.selectedPrioridade);
    }
    if (this.selectedAndar) {
      filtered = filtered.filter(t => t.floor === this.selectedAndar);
    }
    if (this.selectedTipo) {
      filtered = filtered.filter(t => t.type === this.selectedTipo);
    }
    
    this.filteredTickets = filtered;
  }

  // Seleciona um ticket para ver os detalhes
  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  // Quando clica em um item do menu lateral
  onMenuItemClick(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    this.currentView = item.action;
    
    if (item.action === 'usuarios') {
      this.loadUsers(); // Se for gerenciar usuários, carrega a lista
    } else {
      this.clearFilters(); // Senão, limpa os filtros e mostra os tickets
      this.filterTickets();
    }
  }

  // Faz logout do usuário
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

  // Carrega as configurações do usuário do localStorage
  loadUserSettings(): void {
    this.userSettings.nome = localStorage.getItem('userName') || '';
    this.userSettings.email = localStorage.getItem('userEmail') || '';
    this.userSettings.cpf = localStorage.getItem('userCpf') || '';
    this.userSettings.telefone = localStorage.getItem('userTelefone') || '';
    this.userSettings.role = localStorage.getItem('userRole') || '';
    this.userPhoto = localStorage.getItem('userPhoto');
  }

  // Quando o usuário seleciona uma nova foto
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userPhoto = e.target.result; // Converte a imagem para base64
      };
      reader.readAsDataURL(file);
    }
  }

  // Salva as configurações do usuário
  saveSettings(): void {
    localStorage.setItem('userName', this.userSettings.nome);
    localStorage.setItem('userEmail', this.userSettings.email);
    localStorage.setItem('userTelefone', this.userSettings.telefone);
    
    // Só admin pode mudar o próprio role
    if (this.canEditRole()) {
      const oldRole = localStorage.getItem('userRole');
      localStorage.setItem('userRole', this.userSettings.role);
      
      // Se mudou de admin para outro role, redireciona
      if (oldRole === 'ADMIN' && this.userSettings.role !== 'ADMIN') {
        this.redirectBasedOnRole(this.userSettings.role);
        return;
      }
    }
    
    // Salva a foto se tiver uma
    if (this.userPhoto) {
      localStorage.setItem('userPhoto', this.userPhoto);
    }
    
    this.currentUser = this.userSettings.nome;
    alert('Configurações salvas com sucesso!');
    this.closeSettings();
  }

  // Redireciona o usuário baseado no seu role
  redirectBasedOnRole(role: string): void {
    switch(role) {
      case 'ESTUDANTE':
        this.router.navigate(['/dashboarddoestudante']);
        break;
      case 'PROFESSOR':
      case 'FUNCIONARIO':
        this.router.navigate(['/criacao-tickets']);
        break;
      case 'GESTOR':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
    alert('Configurações salvas! Redirecionando...');
    this.closeSettings();
  }

  // Verifica se o usuário pode editar roles (só admin pode)
  canEditRole(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  // Retorna a classe CSS baseada no status do ticket
  getTicketStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }

  // Converte o status para texto em português
  getStatusLabel(status: string): string {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in-progress': return 'Em Andamento';
      case 'closed': return 'Finalizado';
      default: return 'Desconhecido';
    }
  }

  // Retorna o título da aba atual
  getCurrentViewTitle(): string {
    switch(this.currentView) {
      case 'verificar': return 'Tickets Abertos';
      case 'andamentos': return 'Tickets em Andamento';
      case 'finalizados': return 'Tickets Finalizados';
      case 'historico': return 'Histórico de Tickets';
      case 'salas': return 'Tickets por Sala';
      case 'usuarios': return 'Gerenciar Usuários';
      default: return 'Tickets';
    }
  }

  // Limpa todos os filtros
  clearFilters(): void {
    this.selectedSala = '';
    this.selectedPrioridade = '';
    this.selectedAndar = '';
    this.selectedTipo = '';
    this.filterTickets();
  }

  // Seleciona uma sala específica para filtrar
  selectSala(sala: string): void {
    this.selectedSala = sala;
    this.filterTickets();
  }

  // Carrega a lista de usuários do servidor
  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8080/usuarios/findAll').subscribe({
      next: (response) => {
        const rootAdmin = {
          id: 0,
          nome: 'Administrador Root',
          email: 'admin@root.com',
          cpf: '00000000000',
          usuario: 'root',
          role: 'ADMIN'
        };
        
        this.users = [rootAdmin, ...response];
      },
      error: (error) => {
        const rootAdmin = {
          id: 0,
          nome: 'Administrador Root',
          email: 'admin@root.com',
          cpf: '00000000000',
          usuario: 'root',
          role: 'ADMIN'
        };
        
        this.users = [rootAdmin];
      }
    });
  }

  openUserModal(user?: any): void {

    if (user && (user.id === 0 || user.usuario === 'root')) {
      alert('O usuário root não pode ser editado!');
      return;
    }
    
    this.selectedUser = user;
    if (user) {
      this.userForm = { ...user };
    } else {
      this.userForm = {
        nome: '',
        email: '',
        cpf: '',
        usuario: '',
        senha: '',
        role: 'ESTUDANTE'
      };

    }
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  saveUser(): void {
    const url = this.selectedUser ? 
      `http://localhost:8080/api/users/${this.selectedUser.id}` : 
      'http://localhost:8080/api/users';
    
    const method = this.selectedUser ? 'put' : 'post';
    
    this.http[method](url, this.userForm).subscribe({
      next: () => {
        alert(this.selectedUser ? 'Usuário atualizado!' : 'Usuário criado!');
        this.loadUsers();
        this.closeUserModal();
      },
      error: (error) => {
        alert('Erro ao salvar usuário: ' + (error.error?.message || error.message));
      }
    });
  }

  deleteUser(user: any): void {

    if (user.id === 0 || user.usuario === 'root') {
      alert('O usuário root não pode ser excluído!');
      return;
    }
    
    if (confirm(`Deseja excluir o usuário ${user.nome}?`)) {
      this.http.delete(`http://localhost:8080/usuarios/${user.id}`).subscribe({
        next: () => {
          alert('Usuário excluído!');
          this.loadUsers();
        },
        error: (error) => {
          alert('Erro ao excluir usuário: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  openTicketModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.showTicketModal = true;
  }

  closeTicketModal(): void {
    this.showTicketModal = false;
  }

  updateTicketStatus(newStatus: string): void {
    if (!this.selectedTicket) return;
    
    const ticketUpdate = {
      status: newStatus
    };
    
    this.http.put(`http://localhost:8080/api/tickets/${this.selectedTicket.id}`, ticketUpdate).subscribe({
      next: () => {
        alert(`Ticket atualizado!`);
        this.loadTickets();
        this.closeTicketModal();
      },
      error: (error) => {
        if (error.status === 500) {
          alert('Erro interno do servidor. Contate o administrador.');
        } else {
          alert('Erro ao atualizar ticket.');
        }
      }
    });
  }

  getUserPhoto(user: any): string | null {
    // Admin deve ver as fotos de todos os usuários do localStorage
    const userPhoto = localStorage.getItem(`userPhoto_${user.id}`);
    if (userPhoto) {
      return userPhoto;
    }
    
    // Se não tiver no localStorage, tenta pegar do servidor
    return user.photoUrl || user.photo || null;
  }
}