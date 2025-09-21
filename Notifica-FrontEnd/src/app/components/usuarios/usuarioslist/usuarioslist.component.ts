import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { MdbModalService, MdbModalRef, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
import { UsuariosdetailsComponent } from "../usuariosdetails/usuariosdetails.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarioslist',
  imports: [UsuariosdetailsComponent, FormsModule, MdbModalModule],
  templateUrl: './usuarioslist.component.html',
  styleUrl: './usuarioslist.component.scss'
})
export class UsuarioslistComponent {
  lista: Usuario[] = [];
  UsuarioEdit: Usuario = new Usuario();

  modalService = inject(MdbModalService);
  @ViewChild('modalUsuarioDetalhe') modalUsuarioDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  usuarioService = inject(UsuariosService);

  ngOnInit() {
    this.findAll();
  }

  constructor() { }

  findAll() {
    this.usuarioService.findAll().subscribe({
      next: lista => {
        this.lista = lista;
      },
      error: erro => {
        Swal.fire({
          title: 'Erro ao buscar a lista de usuarios',
          text: 'Ocorreu um erro inesperado. Verifique o console para mais detalhes',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  deleteById(usuario: Usuario) {
    Swal.fire({
      title: `Tem certeza que deseja deletar "${usuario.email}"?`,
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        if (typeof usuario.id === 'number') {
          this.usuarioService.delete(usuario.id).subscribe({
            next: () => {
              this.lista = this.lista.filter(s => s.id !== usuario.id);
              Swal.fire({
                title: 'Usuário deletada com sucesso!',
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
    this.UsuarioEdit = new Usuario();
    this.modalRef = this.modalService.open(this.modalUsuarioDetalhe);
  }

  edit(Usuarios: Usuario) {
    if (typeof Usuarios.id === 'number') {
      this.usuarioService.findById(Usuarios.id).subscribe({
        next: (usuarioEncontrado) => {
          this.UsuarioEdit = usuarioEncontrado;
          this.modalRef = this.modalService.open(this.modalUsuarioDetalhe);
        },
        error: (erro) => {
          console.error(erro);
          Swal.fire('Erro!', 'Não foi possível carrega os dados para edição.', 'error');
        }
      });
    } else {
      Swal.fire('Error!', 'Id do usuário não foi definido.', 'error');
    }
  }

  retornoDetalhe(usuario: Usuario) {
    this.findAll();
    this.modalRef.close();
  }

}
