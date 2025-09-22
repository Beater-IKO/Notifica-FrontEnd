import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [MdbFormsModule, MdbRippleModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Campos do formulário de login
  usuario!: string;
  senha!: string;
  selectedRole: string = 'ESTUDANTE';
  
  // Campos do formulário de cadastro
  isRegistering: boolean = false; // Controla se está na tela de cadastro ou login
  nome!: string;
  email!: string;
  cpf!: string;
  confirmSenha!: string;

  // Lista de roles disponíveis no sistema
  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'ESTUDANTE', label: 'Estudante' },
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'FUNCIONARIO', label: 'Funcionário' },
    { value: 'GESTOR', label: 'Gestor' }
  ];

  router = inject(Router);

  constructor(private http: HttpClient) {}

  // Alterna entre tela de login e cadastro
  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.clearForm();
  }

  // Limpa todos os campos do formulário
  clearForm() {
    this.usuario = '';
    this.senha = '';
    this.nome = '';
    this.email = '';
    this.cpf = '';
    this.confirmSenha = '';
    this.selectedRole = 'ESTUDANTE';
  }

  // Cria uma nova conta de usuário
  register() {
    // Valida se todos os campos estão preenchidos
    if (!this.nome || !this.email || !this.cpf || !this.usuario || !this.senha || !this.confirmSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Verifica se as senhas coincidem
    if (this.senha !== this.confirmSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    // Formata o CPF removendo caracteres especiais
    const cpfFormatted = this.cpf.replace(/[^0-9]/g, '');
    if (cpfFormatted.length !== 11) {
      alert('CPF deve ter 11 dígitos.');
      return;
    }

    // Monta o objeto com os dados do novo usuário
    const newUser = {
      nome: this.nome,
      email: this.email,
      cpf: cpfFormatted,
      usuario: this.usuario,
      senha: this.senha,
      role: this.selectedRole
    };

    // Envia os dados para o servidor
    this.http.post('http://localhost:8080/api/users', newUser).subscribe({
      next: (response: any) => {
        alert('Conta criada com sucesso! Faça login agora.');
        this.isRegistering = false;
        this.clearForm();
      },
      error: (error) => {
        // Trata os erros do servidor
        let errorMessage = 'Erro desconhecido';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(`Erro ao criar conta (${error.status}): ${errorMessage}`);
      }
    });
  }

  // Faz login do usuário
  login() {
    // Verifica se é o usuário root (admin padrão)
    if (this.usuario == 'root' && this.senha == 'root') {
      localStorage.setItem('userRole', 'ADMIN');
      localStorage.setItem('userName', 'Administrador Root');
      localStorage.setItem('userId', '0');
      this.router.navigate(['/admin-dashboard']);
    } else {
      // Tenta fazer login com o servidor
      const loginData = {
        usuario: this.usuario,
        senha: this.senha
      };

      this.http.post<any>('http://localhost:8080/api/auth/login', loginData).subscribe({
        next: (response) => {
          // Salva os dados do usuário no localStorage
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('userName', response.nome);
          localStorage.setItem('userId', response.id);
          
          // Redireciona baseado no role do usuário
          switch(response.role) {
            case 'ADMIN':
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'ESTUDANTE':
              this.router.navigate(['dashboarddoestudante']);
              break;
            case 'PROFESSOR':
            case 'FUNCIONARIO':
              this.router.navigate(['criacao-tickets']);
              break;
            case 'GESTOR':
              this.router.navigate(['/admin-dashboard']);
              break;
            default:
              this.router.navigate(['login']);
          }
        },
        error: (error) => {
          alert('Usuário ou senha estão incorretos!');
        }
      });
    }
  }
}
