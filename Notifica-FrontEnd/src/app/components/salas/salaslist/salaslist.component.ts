import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sala } from '../../../models/sala';
import { SalaService } from '../../../services/sala.service';
import { SalasdetailsComponent } from "../salasdetails/salasdetails.component";
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-salaslist',
  imports: [FormsModule, SalasdetailsComponent, MdbModalModule],
  templateUrl: './salaslist.component.html',
  styleUrl: './salaslist.component.scss'
})
export class SalaslistComponent implements OnInit {
  lista: Sala[] = [];
  salaEdit: Sala = new Sala();

  modalService = inject(MdbModalService);
  @ViewChild('modalSalaDetalhe') modalSalaDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  salaService = inject(SalaService);

  ngOnInit() {
    this.findAll();
  }

  constructor() { }

  findAll() {
    this.salaService.findAll().subscribe({
      next: lista => {
        this.lista = lista;
      },
      error: erro => {
        Swal.fire({
          title: 'Erro ao buscar a lista de salas',
          text: 'Ocorreu um erro inesperado. Verifique o console para mais detalhes',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  deleteById(sala: Sala) {
    Swal.fire({
      title: `Tem certeza que deseja deletar "${sala.numero}"?`,
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        if (typeof sala.id === 'number') {
          this.salaService.delete(sala.id).subscribe({
            next: () => {
              this.lista = this.lista.filter(s => s.id !== sala.id);
              Swal.fire({
                title: 'Sala deletada com sucesso!',
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
            text: 'Id da sala não definido.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      }
    });
  }

  new() {
    this.salaEdit = new Sala();
    this.modalRef = this.modalService.open(this.modalSalaDetalhe);
  }

  edit(sala: Sala) {
    if (typeof sala.id === 'number') {
      this.salaService.findById(sala.id).subscribe({
        next: (salaEncontrada) => {
          this.salaEdit = salaEncontrada;
          this.modalRef = this.modalService.open(this.modalSalaDetalhe);
        },
        error: (erro) => {
          console.error(erro);
          Swal.fire('Erro!', 'Não foi possível carrega os dados para edição.', 'error');
        }
      });
    } else {
      Swal.fire('Error!', 'Id da sala não foi definido.', 'error');
    }
  }

  retornoDetalhe(sala: Sala) {
    this.findAll();
    this.modalRef.close();
  }

  trackByFn(index: number, item: Sala): any {
    return item.id;
  }

  getAndarLabel(andar: string): string {
    const andarLabels: { [key: string]: string } = {
      'TERREO': 'Térreo',
      'PRIMEIRO': '1º Andar',
      'SEGUNDO': '2º Andar',
      'TERCEIRO': '3º Andar',
      'QUARTO': '4º Andar'
    };
    return andarLabels[andar] || andar;
  }

  logout(): void {
    // Implementar logout se necessário
  }
}