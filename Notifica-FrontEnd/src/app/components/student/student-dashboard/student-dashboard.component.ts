import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

export interface Ticket {
  id: string;
  title: string;
  room: string;
  floor: string;
  type: string;
  agent: string;
  status: 'open' | 'in-progress' | 'closed';
  description?: string;
  images?: string[];
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MdbRippleModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  
  currentUser = localStorage.getItem('userName') || 'Usuário';
  selectedTicket: Ticket | null = null;
  router = inject(Router);
  
  tickets: Ticket[] = [];

  menuItems = [
    { label: 'Criar Ticket', icon: 'add', active: false, route: '/criacao-tickets' },
    { label: 'Ticket em andamento', icon: 'pending', active: true, route: null },
    { label: 'Finalizados', icon: 'check_circle', active: false, route: null },
    { label: 'Históricos de tickets', icon: 'history', active: false, route: null }
  ];

  constructor() { }

  ngOnInit(): void {
    // Load tickets from backend when implemented
    // For now, tickets array is empty
    this.selectedTicket = null;
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  onMenuItemClick(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  getTicketStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }
}