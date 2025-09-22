import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

// Guard que protege rotas que só estudantes podem acessar
export const studentGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Pega o cargo do usuário salvo no navegador
  const userRole = localStorage.getItem('userRole');
  
  // Se for estudante, deixa entrar na página
  if (userRole === 'ESTUDANTE') {
    return true;
  }
  
  // Se não for estudante, manda de volta pro login
  router.navigate(['/login']);
  return false;
};