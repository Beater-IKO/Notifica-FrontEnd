import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { ProblemaService, TipoProblema } from '../../services/problema.service';

@Component({
  selector: 'app-criacao-tickets',
  imports: [MdbFormsModule, MdbValidationModule, FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './criacao-tickets.component.html',
  styleUrl: './criacao-tickets.component.scss',
})

export class CriacaoTicketsComponent {
  currentUser: string;
  
  problema: string = '';
  area: string = '';
  prioridade: string = '';
  sala: string = '';
  andar: string = '';
  categoriaId: number = 0;
  tipoSelecionado: string = '';
  subtipoSelecionado: string = '';

  salas: string[] = [];
  tipoProblemas: TipoProblema[] = [];
  subtiposDisponiveis: string[] = [];

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private problemaService: ProblemaService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.salas = this.problemaService.getSalas();
    this.tipoProblemas = this.problemaService.getTipoProblemas();
  }

  selecionarTipo(event: any) {
    const tipoSelecionado = event.target.value;
    this.subtiposDisponiveis = this.problemaService.getSubtiposPorTipo(tipoSelecionado);
    this.subtipoSelecionado = '';
  }

  selecionarArea(areaEscolhida: string) {
    this.area = areaEscolhida;
  }

  selecionarAndar(andarEscolhido: string) {
    this.andar = andarEscolhido;
  }

  selecionarPrioridade(prioridadeEscolhida: string) {
    this.prioridade = prioridadeEscolhida;
  }

  criarTicket() {
    if (!this.validarFormulario()) {
      return;
    }

    const ticket: Ticket = {
      problema: this.problema.trim(),
      area: this.area,
      prioridade: this.prioridade,
      status: 'INICIADO',
      user: { id: this.authService.getUserId() }
    };

    this.ticketService.criarTicket(ticket).subscribe({
      next: (response) => {
        alert('Ticket criado com sucesso!');
        this.limparFormulario();
      },
      error: (error) => {
        alert(`Erro ao criar ticket: ${error.error?.message || error.message || 'Erro interno do servidor'}`);
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.problema.trim()) {
      alert('Por favor, preencha a descrição do problema.');
      return false;
    }
    if (!this.area) {
      alert('Por favor, selecione a área da faculdade.');
      return false;
    }
    if (!this.prioridade) {
      alert('Por favor, selecione a prioridade.');
      return false;
    }
    return true;
  }

  limparFormulario() {
    this.problema = '';
    this.area = '';
    this.prioridade = '';
    this.sala = '';
    this.andar = '';
    this.categoriaId = 0;
    this.tipoSelecionado = '';
    this.subtipoSelecionado = '';
    this.subtiposDisponiveis = [];
  }

  logout(): void {
    this.authService.logout();
  }




}


