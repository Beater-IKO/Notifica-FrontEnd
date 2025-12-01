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
  editingTickets: Set<number> = new Set();
  editingData: { [key: number]: any } = {};

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
    // Carregar tickets INICIADO, EM_ANDAMENTO e VISTO
    const ticketsIniciado$ = this.ticketService.obterTicketsPorStatus('INICIADO');
    const ticketsEmAndamento$ = this.ticketService.obterTicketsPorStatus('EM_ANDAMENTO');
    const ticketsVisto$ = this.ticketService.obterTicketsPorStatus('VISTO');
    
    // Combinar as três chamadas
    Promise.all([
      ticketsIniciado$.toPromise(),
      ticketsEmAndamento$.toPromise(),
      ticketsVisto$.toPromise()
    ]).then(([iniciados, emAndamento, visto]) => {
      this.tickets = [...(iniciados || []), ...(emAndamento || []), ...(visto || [])];
      console.log('Tickets em andamento carregados:', this.tickets.length);
      console.log('Dados dos tickets:', this.tickets);
    }).catch(error => {
      console.log('Erro ao carregar tickets em andamento:', error);
      this.tickets = [];
    });
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

  canChangeStatus(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'GESTOR' || this.userRole === 'FUNCIONARIO' || this.userRole === 'PROFESSOR';
  }

  isEditingTicket(ticketId: number): boolean {
    return this.editingTickets.has(ticketId);
  }

  startEdit(ticket: Ticket): void {
    if (!ticket.id) return;
    
    this.editingTickets.add(ticket.id);
    this.editingData[ticket.id] = {
      problema: ticket.problema,
      sala: ticket.sala,
      prioridade: ticket.prioridade
    };
  }

  cancelEdit(ticketId: number): void {
    this.editingTickets.delete(ticketId);
    delete this.editingData[ticketId];
  }

  saveTicket(ticket: Ticket): void {
    if (!ticket.id) return;
    
    const updatedData = this.editingData[ticket.id];
    
    // Atualizar o ticket localmente
    ticket.problema = updatedData.problema;
    ticket.sala = updatedData.sala;
    ticket.prioridade = updatedData.prioridade;
    
    // TODO: Implementar chamada para o backend
    console.log('Salvando ticket:', ticket);
    
    this.cancelEdit(ticket.id);
  }

  updateStatus(ticket: Ticket): void {
    if (!ticket.id) return;
    
    this.ticketService.atualizarStatus(ticket.id, ticket.status).subscribe({
      next: (response) => {
        console.log('Status atualizado com sucesso');
        if (ticket.status === 'FINALIZADOS') {
          this.carregarTickets();
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
      }
    });
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
