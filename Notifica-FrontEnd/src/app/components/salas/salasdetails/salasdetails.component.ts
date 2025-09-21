import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MdbFormsModule } from "mdb-angular-ui-kit/forms";
import { Sala } from '../../../models/sala';
import { SalaService } from '../../../services/sala.service';
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salasdetails',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './salasdetails.component.html',
  styleUrl: './salasdetails.component.scss'
})
export class SalasdetailsComponent {

  @Input() salas: Sala = new Sala();
  @Output() retorno = new EventEmitter<Sala>();

  salaService = inject(SalaService);

  constructor() { }

  save() {
    const isEdit = !!this.salas.id;

    this.salaService.save(this.salas)?.subscribe({
      next: (salaSalva: Sala) => {
        Swal.fire({
          title: isEdit ? 'Registro editado com sucesso!' : 'Registro salvo com sucesso!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.retorno.emit(salaSalva);
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
