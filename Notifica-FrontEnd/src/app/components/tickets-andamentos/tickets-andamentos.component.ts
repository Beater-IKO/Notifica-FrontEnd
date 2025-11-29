import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets-andamentos',
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './tickets-andamentos.component.html',
  styleUrl: './tickets-andamentos.component.scss'
})
export class TicketsAndamentosComponent implements OnInit {
  currentUser: string;
  tickets: Ticket[] = [];
  funcionarios: Usuario[] = [];
  selectedFuncionario: { [key: number]: number } = {};
  userRole: string;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = localStorage.getItem('userRole') || '';
  }

  ngOnInit() {
    console.log('TicketsAndamentosComponent iniciado');
    console.log('User role:', this.userRole);
    console.log('Token presente:', !!localStorage.getItem('jwt-token'));
    
    this.carregarTickets();
    if (this.isAdmin()) {
      this.carregarFuncionarios();
    }
  }

  carregarTickets() {
    // Temporariamente forçar uso do mock se houver problemas com o backend
    const forceMock = true; // Altere para false quando o backend estiver funcionando
    
    if (forceMock) {
      console.log('Forçando uso do mock devido a problemas no backend');
      this.carregarTicketsMock();
      return;
    }
    
    this.ticketService.obterTicketsPorStatus('INICIADO').subscribe({
      next: (response) => {
        this.tickets = response;
        console.log('Tickets carregados do backend:', this.tickets.length);
      },
      error: (error) => {
        console.log('Erro ao carregar tickets do backend:', error);
        console.log('Fallback para dados mock');
        this.carregarTicketsMock();
      }
    });
  }
  
  private carregarTicketsMock() {
    this.tickets = [
      { 
        id: 1, 
        problema: 'Ar condicionado não funciona', 
        sala: 'Sala 101', 
        prioridade: 'Alta', 
        status: 'INICIADO',
        user: { id: 1 }
      },
      { 
        id: 2, 
        problema: 'Projetor com defeito', 
        sala: 'Sala 202', 
        prioridade: 'Média', 
        status: 'INICIADO',
        user: { id: 1 }
      },
      { 
        id: 3, 
        problema: 'Computador não liga', 
        sala: 'Lab 301', 
        prioridade: 'Alta', 
        status: 'INICIADO',
        user: { id: 2 }
      },
      { 
        id: 4, 
        problema: 'Quadro branco riscado', 
        sala: 'Sala 105', 
        prioridade: 'Baixa', 
        status: 'INICIADO',
        user: { id: 1 }
      },
      { 
        id: 5, 
        problema: 'Internet lenta', 
        sala: 'Biblioteca', 
        prioridade: 'Média', 
        status: 'INICIADO',
        user: { id: 3 }
      }
    ];
    console.log('Tickets mock carregados:', this.tickets.length);
  }

  carregarFuncionarios() {
    this.usuariosService.findAll().subscribe({
      next: (usuarios) => {
        // Filtrar apenas funcionários e professores
        this.funcionarios = usuarios.filter(user => 
          user.role === 'FUNCIONARIO' || user.role === 'PROFESSOR'
        );
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
      }
    });
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'GESTOR';
  }

  onFuncionarioChange(ticketId: number) {
    // Método chamado quando o select de funcionário muda
  }

  assignTicket(ticket: Ticket) {
    if (!ticket.id) return;
    
    const funcionarioId = this.selectedFuncionario[ticket.id];
    if (!funcionarioId) return;

    const funcionario = this.funcionarios.find(f => f.id === funcionarioId);
    if (!funcionario) return;

    Swal.fire({
      title: 'Funcionalidade em Desenvolvimento',
      text: `A atribuição de tickets para ${funcionario.nome} será implementada no backend.`,
      icon: 'info',
      confirmButtonText: 'Ok'
    }).then(() => {
      // Limpar seleção
      this.selectedFuncionario[ticket.id!] = 0;
    });
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'FUNCIONARIO': 'Funcionário',
      'PROFESSOR': 'Professor'
    };
    return roleLabels[role] || role;
  }

  logout(): void {
    this.authService.logout();
  }
}
