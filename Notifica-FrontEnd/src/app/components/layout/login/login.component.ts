import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [MdbFormsModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  usuario!: string;
  senha!: string;
  selectedRole: string = 'ESTUDANTE';
  
  // Campos de cadastro
  isRegistering: boolean = false;
  nome!: string;
  email!: string;
  cpf!: string;
  confirmSenha!: string;

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'ESTUDANTE', label: 'Estudante' },
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'FUNCIONARIO', label: 'Funcionário' },
    { value: 'GESTOR', label: 'Gestor' }
  ];

  router = inject(Router);

  constructor(private http: HttpClient) {}

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.clearForm();
  }

  clearForm() {
    this.usuario = '';
    this.senha = '';
    this.nome = '';
    this.email = '';
    this.cpf = '';
    this.confirmSenha = '';
    this.selectedRole = 'ESTUDANTE';
  }

  register() {
    if (!this.nome || !this.email || !this.cpf || !this.usuario || !this.senha || !this.confirmSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (this.senha !== this.confirmSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    // Formatar CPF apenas com números
    const cpfFormatted = this.cpf.replace(/[^0-9]/g, '');
    if (cpfFormatted.length !== 11) {
      alert('CPF deve ter 11 dígitos.');
      return;
    }

    const newUser = {
      nome: this.nome,
      email: this.email,
      cpf: cpfFormatted,
      usuario: this.usuario,
      senha: this.senha,
      role: this.selectedRole
    };

    console.log('Enviando dados do usuário:', newUser);

    this.http.post('http://localhost:8080/api/users', newUser).subscribe({
      next: (response: any) => {
        console.log('Resposta do servidor:', response);
        alert('Conta criada com sucesso! Faça login agora.');
        this.isRegistering = false;
        this.clearForm();
      },
      error: (error) => {
        console.error('Erro completo:', error);
        console.error('Status:', error.status);
        console.error('Error body:', error.error);
        console.error('Response text:', error.error);
        
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

  login() {
    if (this.usuario == 'root' && this.senha == 'root') {
      localStorage.setItem('userRole', this.selectedRole);
      
      // Definir nome de exibição baseado no papel
      let displayName = '';
      switch(this.selectedRole) {
        case 'ADMIN':
          displayName = 'Administrador';
          break;
        case 'ESTUDANTE':
          displayName = 'Estudante';
          break;
        case 'PROFESSOR':
          displayName = 'Professor';
          break;
        case 'FUNCIONARIO':
          displayName = 'Funcionário';
          break;
        case 'GESTOR':
          displayName = 'Gestor';
          break;
        default:
          displayName = 'Usuário';
      }
      localStorage.setItem('userName', displayName);
      
      switch(this.selectedRole) {
        case 'ADMIN':
          this.router.navigate(['admin/usuarios']);
          break;
        case 'ESTUDANTE':
          this.router.navigate(['dashboarddoestudante']);
          break;
        case 'PROFESSOR':
        case 'FUNCIONARIO':
          this.router.navigate(['criacao-tickets']);
          break;
        case 'GESTOR':
          this.router.navigate(['admin/usuarios']);
          break;
        default:
          this.router.navigate(['login']);
      }
    } else {
      // Tentar autenticar com o backend
      const loginData = {
        usuario: this.usuario,
        senha: this.senha
      };

      this.http.post<any>('http://localhost:8080/api/auth/login', loginData).subscribe({
        next: (response) => {
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('userName', response.nome);
          localStorage.setItem('userId', response.id);
          
          switch(response.role) {
            case 'ADMIN':
              this.router.navigate(['admin/usuarios']);
              break;
            case 'ESTUDANTE':
              this.router.navigate(['dashboarddoestudante']);
              break;
            case 'PROFESSOR':
            case 'FUNCIONARIO':
              this.router.navigate(['criacao-tickets']);
              break;
            case 'GESTOR':
              this.router.navigate(['admin/usuarios']);
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
