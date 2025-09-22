import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

// Guard que protege rotas que professores, funcionários e estudantes podem acessar
export const staffGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Pega o cargo do usuário salvo no navegador
  const userRole = localStorage.getItem('userRole');
  
  // Se for professor, funcionário ou estudante, deixa entrar
  if (userRole === 'PROFESSOR' || userRole === 'FUNCIONARIO' || userRole === 'ESTUDANTE') {
    return true;
  }
  
  // Se não for nenhum desses, manda de volta pro login
  router.navigate(['/login']);
  return false;
};