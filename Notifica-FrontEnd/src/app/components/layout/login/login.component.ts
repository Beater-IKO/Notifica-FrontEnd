import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario';
import { Role } from '../../../models/enums/role.enum';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [MdbFormsModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Dados específicos para LOGIN
  dadosLogin = {
    email: '',
    senha: ''
  };
  
  // Dados específicos para CADASTRO
  isRegistering: boolean = false;
  dadosCadastro = {
    nome: '',
    email: '',
    cpf: '',
    usuario: '',
    senha: '',
    confirmSenha: '',
    role: 'ESTUDANTE'
  };

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'ESTUDANTE', label: 'Estudante' },
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'FUNCIONARIO', label: 'Funcionário' },
    { value: 'GESTOR', label: 'Gestor' }
  ];

  router = inject(Router);

  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) {}

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.clearForm();
  }

  clearForm() {
    this.dadosLogin = { email: '', senha: '' };
    this.dadosCadastro = {
      nome: '',
      email: '',
      cpf: '',
      usuario: '',
      senha: '',
      confirmSenha: '',
      role: 'ESTUDANTE'
    };
  }

  register() {
    if (!this.dadosCadastro.nome || !this.dadosCadastro.email || !this.dadosCadastro.cpf || !this.dadosCadastro.usuario || !this.dadosCadastro.senha || !this.dadosCadastro.confirmSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (this.dadosCadastro.senha !== this.dadosCadastro.confirmSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const cpfFormatted = this.dadosCadastro.cpf.replace(/[^0-9]/g, '');
    if (cpfFormatted.length !== 11) {
      alert('CPF deve ter 11 dígitos.');
      return;
    }

    const newUser: Usuario = {
      nome: this.dadosCadastro.nome,
      email: this.dadosCadastro.email,
      cpf: cpfFormatted,
      senha: this.dadosCadastro.senha,
      role: this.dadosCadastro.role as Role
    } as Usuario;

    console.log('Enviando dados do usuário:', newUser);

    this.usuariosService.save(newUser).subscribe({
      next: (response: any) => {
        alert('Conta criada com sucesso! Faça login agora.');
        this.isRegistering = false;
        this.clearForm();
      },
      error: (error) => {
        alert(`Erro ao criar conta: ${error.error?.message || 'Erro interno'}`);
      }
    });
  }

  login() {
    if (!this.dadosLogin.email || !this.dadosLogin.senha) {
      alert('Por favor, preencha email e senha.');
      return;
    }

    console.log('Enviando para o login:', this.dadosLogin);

    this.authService.login(this.dadosLogin).subscribe({
      next: (response) => {
        console.log('Login realizado com sucesso!', response);
      },
      error: (error) => {
        console.error('Falha na autenticação:', error);
        alert('Email ou senha incorretos!');
      }
    });
  }
}
