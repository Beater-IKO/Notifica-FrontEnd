import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Chamado {
  id: number;
  usuario: string;
  problema: string;
  local: string;
  andar: string;
  sala: string;
  area: string;
  prioridade: string;
  descricao: string;
  estouCiente?: boolean;
  aFazer?: boolean;
  finalizado?: boolean;
}

@Component({
  selector: 'app-visualizar-chamados',
  standalone: true,
  imports: [MdbFormsModule, MdbValidationModule, FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './visualizar-chamados.component.html',
  styleUrl: './visualizar-chamados.component.scss',
})
export class VisualizarChamadosComponent implements OnInit {
  currentUser: string;
  showDropdown: boolean = false;
  chamados: Chamado[] = [];
  chamadoSelecionado?: Chamado;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    // Chamados simulados - depois você pode buscar do backend
    this.chamados = [
      {
        id: 1,
        usuario: 'Usuário 1',
        problema: 'Piso quebrado',
        local: 'Interno',
        andar: '2º Andar',
        sala: 'Sala 310',
        area: 'Infraestrutura',
        prioridade: 'Médio',
        descricao: 'O piso da sala está cheio de fissuras e buracos, causando riscos de acidentes e distrações nas aulas.'
      },
      {
        id: 2,
        usuario: 'Usuário 2',
        problema: 'Paredes sujas',
        local: 'Interno',
        andar: '2º Andar',
        sala: 'Sala 215',
        area: 'Limpeza',
        prioridade: 'Leve',
        descricao: 'As paredes estão sujas e precisam de nova pintura.'
      },
      {
        id: 3,
        usuario: 'Usuário 3',
        problema: 'Teto com infiltração',
        local: 'Interno',
        andar: 'Subsolo',
        sala: 'Sala 120',
        area: 'Infraestrutura',
        prioridade: 'Grave',
        descricao: 'Há infiltrações no teto que podem causar danos elétricos e estruturais.'
      }
    ];
  }

  selecionarChamado(chamado: Chamado) {
    this.chamadoSelecionado = chamado;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
  }

  voltar(): void {
    this.router.navigate(['/tela-de-funcionarios']);
  }

  mostrarModal: boolean = false;
quantidade: number = 0;

abrirModal() {
  this.mostrarModal = true;
}

fecharModal() {
  this.mostrarModal = false;
}

}
