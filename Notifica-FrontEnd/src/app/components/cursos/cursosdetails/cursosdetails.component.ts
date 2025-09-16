import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MdbFormsModule } from "mdb-angular-ui-kit/forms";
import { Curso } from '../../../models/curso';
import { CursoService } from '../../../services/curso.service';
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursosdetails',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './cursosdetails.component.html',
  styleUrl: './cursosdetails.component.scss'
})
export class CursosdetailsComponent {

  @Input() cursos: Curso = new Curso();
  @Output() retorno = new EventEmitter<Curso>();

  cursoService = inject(CursoService);

  constructor() { }

  save() {
    const isEdit = this.cursos.id !== undefined && this.cursos.id !== null;


    this.cursoService.save(this.cursos)?.subscribe({
      next: (cursoSalva: Curso) => {
        Swal.fire({
          title: isEdit ? 'Registro editado com sucesso!' : 'Registro salvo com sucesso!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.retorno.emit(cursoSalva);
      },
      error: (erro: any) => {
        console.error('Erro ao salvar sala', erro);

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
