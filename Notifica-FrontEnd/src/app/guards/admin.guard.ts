import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

// Guard que protege rotas que só admin e gestor podem acessar
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Pega o cargo do usuário salvo no navegador
  const userRole = localStorage.getItem('userRole');
  
  // Se for admin ou gestor, deixa entrar na página
  if (userRole === 'ADMIN' || userRole === 'GESTOR') {
    return true;
  }
  
  // Se não for, manda de volta pro login
  router.navigate(['/login']);
  return false;
};