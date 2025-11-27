import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { MdbModalService, MdbModalRef, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
import { UsuariosdetailsComponent } from "../usuariosdetails/usuariosdetails.component";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarioslist',
  imports: [UsuariosdetailsComponent, FormsModule, MdbModalModule, CommonModule],
  templateUrl: './usuarioslist.component.html',
  styleUrl: './usuarioslist.component.scss'
})
export class UsuarioslistComponent {
  lista: Usuario[] = [];
  UsuarioEdit: Usuario = new Usuario();
  currentUser: Usuario = new Usuario();
  currentUserName: string = '';
  showUserProfile: boolean = false;

  modalService = inject(MdbModalService);
  @ViewChild('modalUsuarioDetalhe') modalUsuarioDetalhe!: TemplateRef<any>;
  @ViewChild('modalUserProfile') modalUserProfile!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  usuarioService = inject(UsuariosService);
  authService = inject(AuthService);

  ngOnInit() {
    this.findAll();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.currentUserName = this.authService.getCurrentUser();
    const userId = this.authService.getUserId();
    
    if (userId) {
      this.usuarioService.findById(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (erro) => {
          console.error('Erro ao carregar dados do usuário:', erro);
        }
      });
    }
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

  trackByFn(index: number, item: Usuario): any {
    return item.id;
  }

  formatCpf(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getRoleClass(role: string): string {
    const roleClasses: { [key: string]: string } = {
      'ADMIN': 'role-admin',
      'GESTOR': 'role-gestor',
      'PROFESSOR': 'role-professor',
      'FUNCIONARIO': 'role-funcionario',
      'ESTUDANTE': 'role-estudante'
    };
    return roleClasses[role] || 'role-default';
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'GESTOR': 'Gestor',
      'PROFESSOR': 'Professor',
      'FUNCIONARIO': 'Funcionário',
      'ESTUDANTE': 'Estudante'
    };
    return roleLabels[role] || role;
  }

  logout(): void {
    this.authService.logout();
  }

  openUserProfile(): void {
    this.showUserProfile = true;
    this.modalRef = this.modalService.open(this.modalUserProfile);
  }

  updateCurrentUser(): void {
    if (this.currentUser.id) {
      this.usuarioService.save(this.currentUser).subscribe({
        next: (updatedUser) => {
          Swal.fire({
            title: 'Perfil atualizado com sucesso!',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          this.currentUser = updatedUser;
          this.modalRef.close();
        },
        error: (erro) => {
          console.error(erro);
          Swal.fire({
            title: 'Erro ao atualizar perfil',
            text: erro.error?.message || 'Não foi possível atualizar o perfil',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    }
  }
}
