import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('jwt-token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const path = route.routeConfig?.path || '';

    // Verificar permissões por role
    if (path.startsWith('admin') && userRole !== 'ADMIN' && userRole !== 'GESTOR') {
      this.redirectByRole(userRole);
      return false;
    }

    if (path === 'student' && userRole !== 'ESTUDANTE') {
      this.redirectByRole(userRole);
      return false;
    }

    return true;
  }

  private redirectByRole(role: string | null): void {
    switch (role) {
      case 'ADMIN':
      case 'GESTOR':
        this.router.navigate(['/admin/usuarios']);
        break;
      case 'ESTUDANTE':
        this.router.navigate(['/student']);
        break;
      case 'PROFESSOR':
      case 'FUNCIONARIO':
        // rota no arquivo de rotas é `tela-de-funcionarios`
        this.router.navigate(['/tela-de-funcionarios']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}