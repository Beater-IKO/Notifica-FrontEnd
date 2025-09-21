import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core'; // ADICIONADO OnInit
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/usuario';
import { Sala } from '../../../models/sala'; // ADIÇÃO: Importe o modelo da Sala
import { UsuariosService } from '../../../services/usuarios.service';
import { MdbFormsModule } from "mdb-angular-ui-kit/forms";
import { CommonModule } from '@angular/common'; // ADIÇÃO: Necessário para *ngFor
import { FormsModule } from '@angular/forms';
import { SalaService } from '../../../services/sala.service';

@Component({
  selector: 'app-usuariosdetails',
  standalone: true, // ADIÇÃO: Componentes standalone precisam ser declarados
  imports: [MdbFormsModule, FormsModule, CommonModule], // ADIÇÃO: CommonModule
  templateUrl: './usuariosdetails.component.html',
  styleUrl: './usuariosdetails.component.scss'
})
export class UsuariosdetailsComponent implements OnInit { // ADICIONADO implements OnInit
  @Input() usuarios: Usuario = new Usuario();
  @Output() retorno = new EventEmitter<Usuario>();

  usuarioService = inject(UsuariosService);

  // --- INÍCIO DAS ADIÇÕES ---
  salaService = inject(SalaService); // Injeta o serviço para buscar as salas
  listaDeSalas: Sala[] = []; // Array para armazenar as salas para o dropdown
  salaSelecionadaId: number | null = null; // Guarda o ID da sala selecionada no dropdown
  // --- FIM DAS ADIÇÕES ---

  constructor() { }

  // ADIÇÃO: Método ngOnInit para carregar os dados iniciais
  ngOnInit() {
    this.carregarSalas();
    // Se estiver editando um usuário que já tem uma sala, pré-seleciona ela no dropdown
    if (this.usuarios && this.usuarios.sala) {
      this.salaSelecionadaId = this.usuarios.sala.id;
    }
  }

  // ADIÇÃO: Método para buscar a lista de salas no backend
  carregarSalas() {
    this.salaService.findAll().subscribe(salas => {
      this.listaDeSalas = salas;
    });
  }

  save() {
    const isEdit = !!this.usuarios.id;

    if (this.salaSelecionadaId) {
      this.usuarios.sala = { id: this.salaSelecionadaId } as Sala;
    } else {
      this.usuarios.sala = null;
    }

    this.usuarioService.save(this.usuarios)?.subscribe({
      next: (usuarioSalvo: Usuario) => {
        Swal.fire({
          title: isEdit ? 'Registro editado com sucesso!' : 'Registro salvo com sucesso!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.retorno.emit(usuarioSalvo);
      },
      error: (erro: any) => {
        console.error('Erro ao salvar usuário', erro);

        let errorMessage = 'Ocorreu um erro ao salvar.';
        if (erro.error && erro.error.errors) {
          errorMessage = erro.error.errors.map((e: any) => e.message).join('<br>');
        } else if (erro.error && erro.error.message) {
          errorMessage = erro.error.message;
        }

        Swal.fire({
          title: 'Erro ao salvar',
          html: errorMessage,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

}
