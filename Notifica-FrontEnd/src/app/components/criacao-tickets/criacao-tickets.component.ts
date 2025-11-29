import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { ProblemaService, TipoProblema } from '../../services/problema.service';
import { SalaService } from '../../services/sala.service';
import { Sala } from '../../models/sala';

@Component({
  selector: 'app-criacao-tickets',
  imports: [MdbFormsModule, MdbValidationModule, FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './criacao-tickets.component.html',
  styleUrl: './criacao-tickets.component.scss',
})

export class CriacaoTicketsComponent implements OnInit {
  currentUser: string;

  problema: string = '';
  prioridade: string = '';
  sala: any = '';
  categoriaId: number = 0;
  tipoSelecionado: string = '';
  subtipoSelecionado: string = '';

  salas: Sala[] = [];
  tipoProblemas: TipoProblema[] = [];
  subtiposDisponiveis: string[] = [];

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private problemaService: ProblemaService,
    private salaService: SalaService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.tipoProblemas = this.problemaService.getTipoProblemas();
  }

  ngOnInit(): void {
    this.salaService.findAll().subscribe({
      next: (resultado) => {
        this.salas = resultado || [];
      },
      error: (err) => {
        console.error('Erro ao carregar salas:', err);
        // fallback simples: usar lista estática do ProblemaService (map para Sala)
        const fallback = this.problemaService.getSalas();
        this.salas = fallback.map(s => {
          const numeroStr = (s || '').toString().replace(/[^0-9]/g, '');
          return { numero: numeroStr ? Number(numeroStr) : s } as unknown as Sala;
        });
      }
    });
  }

  selecionarTipo(event: any) {
    const tipoSelecionado = event.target.value;
    this.subtiposDisponiveis = this.problemaService.getSubtiposPorTipo(tipoSelecionado);
    this.subtipoSelecionado = '';
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
      prioridade: this.prioridade,
      sala: this.sala,
      status: 'INICIADO',
      user: { id: this.authService.getUserId() },

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
    if (!this.prioridade) {
      alert('Por favor, selecione a prioridade.');
      return false;
    }
    return true;
  }

  limparFormulario() {
    this.problema = '';
    this.prioridade = '';
    this.sala = '';
    this.categoriaId = 0;
    this.tipoSelecionado = '';
    this.subtipoSelecionado = '';
    this.subtiposDisponiveis = [];
  }

  logout(): void {
    this.authService.logout();
  }




}


