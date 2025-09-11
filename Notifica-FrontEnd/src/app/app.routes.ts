import { Routes } from '@angular/router';
import { CriacaoTicketsComponent } from './components/criacao-tickets/criacao-tickets.component';

export const routes: Routes = [

    {path:"", redirectTo:"criacao-tickets", pathMatch:"full"},
    {path:"criacao-tickets", component: CriacaoTicketsComponent}


];
