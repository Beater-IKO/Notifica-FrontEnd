import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../shared/header/header.component';
import { UserService } from '../../services/user.service';
import { TicketService } from '../../services/ticket.service';


@Component({
  selector: 'app-criacao-tickets',
  imports: [MdbFormsModule, MdbValidationModule, FormsModule, RouterModule, CommonModule, HttpClientModule, HeaderComponent],
  templateUrl: './criacao-tickets.component.html',
  styleUrl: './criacao-tickets.component.scss',
})

export class CriacaoTicketsComponent implements OnInit {
  router = inject(Router);
  
  // Campos do formulário de criação de ticket
  problema: string = ''; // Descrição do problema
  area: string = ''; // Área da faculdade (elétrica, hidráulica, etc)
  prioridade: string = ''; // Nível de prioridade
  sala: string = ''; // Sala onde está o problema
  andar: string = ''; // Andar da sala
  categoriaId: number = 0;
  userId: number = 1;
  tipoSelecionado: string = ''; // Tipo de problema selecionado
  subtipoSelecionado: string = ''; // Subtipo específico

  // Lista de salas disponíveis
  salas = ['Sala 101', 'Sala 102', 'Sala 201', 'Sala 202', 'Laboratório 1', 'Laboratório 2'];

  // Tipos de problemas e seus subtipos
  tipoProblemas = [
    {
      nome: 'Ar Condicionado',
      subtipos: ['Não liga', 'Não gela', 'Vazamento', 'Ruído excessivo', 'Controle não funciona']
    },
    {
      nome: 'Elétrica',
      subtipos: ['Tomada não funciona', 'Lâmpada queimada', 'Disjuntor desarmado', 'Falta de energia']
    },
    {
      nome: 'Hidráulica',
      subtipos: ['Vazamento', 'Entupimento', 'Torneira quebrada', 'Vaso sanitário com problema']
    },
    {
      nome: 'Mobiliário',
      subtipos: ['Mesa quebrada', 'Cadeira com defeito', 'Armário danificado', 'Gaveta emperrada']
    }
  ];

  subtiposDisponiveis: string[] = []; // Subtipos do tipo selecionado

  constructor(private http: HttpClient, private userService: UserService, private ticketService: TicketService) {}

  // Quando seleciona um tipo de problema, carrega os subtipos
  selecionarTipo(event: any) {
    const tipoSelecionado = event.target.value;
    const tipo = this.tipoProblemas.find(t => t.nome === tipoSelecionado);
    this.subtiposDisponiveis = tipo ? tipo.subtipos : [];
    this.subtipoSelecionado = ''; // Limpa o subtipo selecionado
  }

  // Define a área selecionada
  selecionarArea(areaEscolhida: string) {
    this.area = areaEscolhida;
  }

  // Define o andar selecionado
  selecionarAndar(andarEscolhido: string) {
    this.andar = andarEscolhido;
  }

  // Define a prioridade selecionada
  selecionarPrioridade(prioridadeEscolhida: string) {
    this.prioridade = prioridadeEscolhida;
  }

  // Cria um novo ticket
  criarTicket() {
    // Valida se os campos obrigatórios estão preenchidos
    if (!this.problema.trim()) {
      alert('Por favor, preencha a descrição do problema.');
      return;
    }
    if (!this.area) {
      alert('Por favor, selecione a área da faculdade.');
      return;
    }
    if (!this.prioridade) {
      alert('Por favor, selecione a prioridade.');
      return;
    }

    // Pega o ID do usuário logado
    const userId = localStorage.getItem('userId');
    
    // Monta o objeto do ticket
    const ticket = {
      problema: this.problema.trim(),
      area: this.area,
      prioridade: this.prioridade,
      status: 'INICIADO',
      user: { id: userId ? parseInt(userId) : 1 }
    };

    // Envia o ticket para o servidor
    this.ticketService.createTicket(ticket).subscribe({
      next: (response) => {
        alert('Ticket criado com sucesso!');
        this.limparFormulario();
      },
      error: (error) => {
        alert(`Erro ao criar ticket: ${error.error?.message || error.message || 'Erro interno do servidor'}`);
      }
    });
  }

  // Limpa todos os campos do formulário
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

  // Função que executa quando o componente carrega
  ngOnInit(): void {
    // Não precisa fazer nada por enquanto
  }


}
