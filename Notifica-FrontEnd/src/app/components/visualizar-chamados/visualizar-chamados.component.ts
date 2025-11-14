import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
}

@Component({
  selector: 'app-visualizar-chamados',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './visualizar-chamados.component.html',
  styleUrl: './visualizar-chamados.component.scss',
})
export class VisualizarChamadosComponent implements OnInit {
  currentUser: string;
  chamados: Chamado[] = [];
  chamadoSelecionado?: Chamado;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.carregarPresets();
    this.carregarTicketsBackend();
  }

  /** 🎨 Presets já estilizados */
  carregarPresets() {
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
        descricao: 'O piso da sala está cheio de fissuras e buracos, causando riscos de acidentes.'
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
        descricao: 'Há infiltrações no teto que podem causar danos elétricos.'
      }
    ];
  }

  /** 🔗 Busca do backend e adiciona ao array */
  carregarTicketsBackend() {
    this.http.get<any[]>("http://localhost:8080/api/tickets/findAll")
      .subscribe({
        next: (tickets) => {
          const convertidos = tickets.map(t => ({
            id: t.id,
            usuario: t.user?.nome ?? "Admin",
            problema: t.problema,
            local: "Interno",
            andar: t.area?.andar ?? "Não informado",
            sala: t.area?.sala ?? "Não informado",
            area: t.area?.nome ?? "Desconhecida",
            prioridade: t.prioridade,
            descricao: t.problema
          }));

          this.chamados = [...this.chamados, ...convertidos]; // Mantém os presets
        },
        error: (err) => console.error("Erro ao carregar tickets:", err)
      });
  }

  selecionarChamado(chamado: Chamado) {
    this.chamadoSelecionado = chamado;
  }

  logout() {
    this.authService.logout();
  }

  voltar() {
    this.router.navigate(['/tela-de-funcionarios']);
  }

  abrirModal() {
    // Implementar lógica do modal aqui
    console.log('Modal aberto');
  }
}
