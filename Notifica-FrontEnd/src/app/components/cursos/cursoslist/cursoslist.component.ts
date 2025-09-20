import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Curso } from '../../../models/curso';
import { CursoService } from '../../../services/curso.service';
import { CursosdetailsComponent } from "../cursosdetails/cursosdetails.component";
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursoslist',
  imports: [FormsModule, CursosdetailsComponent, MdbModalModule],
  templateUrl: './cursoslist.component.html',
  styleUrl: './cursoslist.component.scss'
})
export class CursoslistComponent implements OnInit{

  lista: Curso[] = [];
    cursoEdit: Curso = new Curso();
  
    modalService = inject(MdbModalService);
    @ViewChild('modalCursoDetalhe') modalCursoDetalhe!: TemplateRef<any>;
    modalRef!: MdbModalRef<any>;
  
    cursoService = inject(CursoService);
  
    ngOnInit() {
      this.findAll();
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
            this.modalRef = this.modalService.open(this.modalCursoDetalhe);
          },
          error: (erro) => {
            console.error(erro);
            Swal.fire('Erro!', 'Não foi possível carrega os dados para edição.', 'error');
          }
        });
      } else {
        Swal.fire('Error!', 'Id do curso não foi definido.', 'error');
      }
    }
  
    retornoDetalhe(curso: Curso) {
      this.findAll();
      this.modalRef.close();
    }

}
