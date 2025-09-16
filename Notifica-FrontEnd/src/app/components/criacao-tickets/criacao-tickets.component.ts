import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { RouterModule, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-criacao-tickets',
  imports: [MdbFormsModule, MdbValidationModule, FormsModule, RouterOutlet, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './criacao-tickets.component.html',
  styleUrl: './criacao-tickets.component.scss',
})

export class CriacaoTicketsComponent {
  problema: string = '';
  area: string = '';
  prioridade: string = '';
  sala: string = '';
  andar: string = '';
  categoriaId: number = 0;
  userId: number = 1;
  tipoSelecionado: string = '';
  subtipoSelecionado: string = '';

  salas = ['Sala 101', 'Sala 102', 'Sala 201', 'Sala 202', 'Laboratório 1', 'Laboratório 2'];

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

  subtiposDisponiveis: string[] = [];

  constructor(private http: HttpClient) {}

  selecionarTipo(event: any) {
    const tipoSelecionado = event.target.value;
    const tipo = this.tipoProblemas.find(t => t.nome === tipoSelecionado);
    this.subtiposDisponiveis = tipo ? tipo.subtipos : [];
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
    const ticket = {
      problema: this.problema,
      area: this.area,
      prioridade: this.prioridade,
      status: 'ABERTO',
      user: { id: this.userId },
      categoria: { id: this.categoriaId }
    };

    this.http.post('http://localhost:8080/api/tickets', ticket).subscribe({
      next: (response) => {
        alert('Ticket criado com sucesso!');
        this.limparFormulario();
      },
      error: (error) => {
        alert('Erro ao criar ticket!');
      }
    });
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
}


