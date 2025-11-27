import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { MdbFormsModule } from "mdb-angular-ui-kit/forms";
import { Curso } from '../../../models/curso';
import { CursoService } from '../../../services/curso.service';
import { SalaService } from '../../../services/sala.service';
import { Sala } from '../../../models/sala';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursosdetails',
  imports: [MdbFormsModule, FormsModule, CommonModule],
  templateUrl: './cursosdetails.component.html',
  styleUrl: './cursosdetails.component.scss'
})
export class CursosdetailsComponent implements OnInit {

  @Input() cursos: Curso = new Curso();
  @Output() retorno = new EventEmitter<Curso>();
  salas: Sala[] = [];

  cursoService = inject(CursoService);
  salaService = inject(SalaService);

  constructor() { }

  ngOnInit() {
    this.salaService.findAll().subscribe({
      next: (salas: Sala[]) => this.salas = salas,
      error: (error) => console.error('Erro ao carregar salas:', error)
    });
  }

  compareSalas(sala1: Sala, sala2: Sala): boolean {
    return sala1 && sala2 ? sala1.id === sala2.id : sala1 === sala2;
  }

  save() {
    // Check if user is authenticated
    const token = localStorage.getItem('jwt-token');
    if (!token) {
      Swal.fire({
        title: 'Erro de autenticação',
        text: 'Você precisa fazer login novamente.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    
    const isEdit = this.cursos.id !== undefined && this.cursos.id !== null;
    
    // Log para debug
    console.log('Curso antes de salvar:', this.cursos);
    console.log('Sala selecionada:', this.cursos.sala);
    
    // Criar uma cópia limpa do curso para evitar referências circulares
    const cursoParaSalvar = {
      id: this.cursos.id,
      nome: this.cursos.nome,
      duracao: this.cursos.duracao,
      sala: this.cursos.sala ? { id: this.cursos.sala.id } : null
    };
    
    console.log('Curso que será enviado:', cursoParaSalvar);

    this.cursoService.save(cursoParaSalvar)?.subscribe({
      next: (cursoSalva: Curso) => {
        console.log('Curso salvo retornado pelo backend:', cursoSalva);
        Swal.fire({
          title: isEdit ? 'Registro editado com sucesso!' : 'Registro salvo com sucesso!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.retorno.emit(cursoSalva);
      },
      error: (erro: any) => {
        console.error('Erro ao salvar curso', erro);

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
