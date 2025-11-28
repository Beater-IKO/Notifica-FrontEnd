import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Curso } from '../../../models/curso';
import { CursoService } from '../../../services/curso.service';
import { CursosdetailsComponent } from "../cursosdetails/cursosdetails.component";
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursoslist',
  imports: [FormsModule, CommonModule, CursosdetailsComponent, MdbModalModule],
  templateUrl: './cursoslist.component.html',
  styleUrl: './cursoslist.component.scss'
})
export class CursoslistComponent implements OnInit{

  lista: Curso[] = [];
    cursoEdit: Curso = new Curso();
    currentUser: string = '';
  
    modalService = inject(MdbModalService);
    @ViewChild('modalCursoDetalhe') modalCursoDetalhe!: TemplateRef<any>;
    modalRef!: MdbModalRef<any>;
  
    cursoService = inject(CursoService);
    authService = inject(AuthService);
  
    ngOnInit() {
      this.findAll();
      this.currentUser = this.authService.getCurrentUser();
    }
  
    constructor() { }
  
    findAll() {
      this.cursoService.findAll().subscribe({
        next: lista => {
          this.lista = lista;
        },
        error: erro => {
          Swal.fire({
            title: 'Erro ao buscar a lista de cursos',
            text: 'Ocorreu um erro inesperado. Verifique o console para mais detalhes',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        },
      });
    }
  
    deleteById(curso: Curso) {
      Swal.fire({
        title: `Tem certeza que deseja deletar "${curso.nome}"?`,
        icon: 'warning',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Sim',
        denyButtonText: 'Não'
      }).then((result) => {
        if (result.isConfirmed) {
          if (typeof curso.id === 'number') {
            this.cursoService.delete(curso.id).subscribe({
              next: () => {
                this.lista = this.lista.filter(s => s.id !== curso.id);
                Swal.fire({
                  title: 'Curso deletado com sucesso!',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                });
              },
              error: (erro) => {
                console.error(erro);
                Swal.fire({
                  title: 'Erro ao deletar',
                  text: erro.error?.message || 'Não foi possível remover o registro',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
              }
            });
          } else {
            Swal.fire({
              title: 'Erro ao deletar',
              text: 'Id do curso não definido.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        }
      });
    }
  
    new() {
      this.cursoEdit = new Curso();
      this.modalRef = this.modalService.open(this.modalCursoDetalhe);
    }
  
    edit(curso: Curso) {
      if (typeof curso.id === 'number') {
        this.cursoService.findById(curso.id).subscribe({
          next: (cursoEncontrada) => {
            this.cursoEdit = cursoEncontrada;
            // Mapear a última sala do array para a propriedade sala (mais recente)
            if (cursoEncontrada.salas && cursoEncontrada.salas.length > 0) {
              this.cursoEdit.sala = cursoEncontrada.salas[cursoEncontrada.salas.length - 1];
            }
            this.modalRef = this.modalService.open(this.modalCursoDetalhe);
          },
          error: (erro) => {
            console.error('Erro ao buscar curso por ID:', erro);
            // Se der erro 403, usa o curso da lista mesmo
            if (erro.status === 403) {
              this.cursoEdit = { ...curso }; // Clona o curso
              // Mapear a última sala do array para a propriedade sala (mais recente)
              if (curso.salas && curso.salas.length > 0) {
                this.cursoEdit.sala = curso.salas[curso.salas.length - 1];
              }
              this.modalRef = this.modalService.open(this.modalCursoDetalhe);
            } else {
              Swal.fire('Erro!', 'Não foi possível carregar os dados para edição.', 'error');
            }
          }
        });
      } else {
        Swal.fire('Error!', 'Id do curso não foi definido.', 'error');
      }
    }
  
    retornoDetalhe(curso: Curso) {
      // Salvar a sala selecionada no localStorage
      if (this.cursoEdit.sala && this.cursoEdit.sala.id) {
        localStorage.setItem(`curso_${curso.id}_sala_selecionada`, this.cursoEdit.sala.id.toString());
      }
      
      this.modalRef.close();
      this.findAll();
    }

    trackByFn(index: number, item: Curso): any {
      return item.id;
    }

    getSalaAtual(curso: Curso): string {
      if (!curso.salas || curso.salas.length === 0) {
        return 'Sem sala definida';
      }
      
      // Verificar se há uma sala selecionada salva no localStorage
      const salaSelecionadaId = localStorage.getItem(`curso_${curso.id}_sala_selecionada`);
      if (salaSelecionadaId) {
        const salaEncontrada = curso.salas.find(sala => sala.id.toString() === salaSelecionadaId);
        if (salaEncontrada) {
          return `Sala ${salaEncontrada.numero}`;
        }
      }
      
      // Caso contrário, mostrar a última sala (mais recente)
      const ultimaSala = curso.salas[curso.salas.length - 1];
      return `Sala ${ultimaSala.numero}`;
    }

    logout() {
      this.authService.logout();
    }

}
