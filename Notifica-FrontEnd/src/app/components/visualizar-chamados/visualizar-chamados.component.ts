import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-visualizar-chamados',
  imports: [MdbFormsModule, MdbValidationModule, FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './visualizar-chamados.component.html',
  styleUrl: './visualizar-chamados.component.scss',
})
export class VisualizarChamadosComponent {
  currentUser: string;
  showDropdown: boolean = false;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
  }
}