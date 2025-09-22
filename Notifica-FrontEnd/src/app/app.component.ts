import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente principal da aplicação - é o primeiro que carrega
@Component({
  selector: 'app-root', // Nome do componente no HTML
  imports: [RouterOutlet], // Importa o RouterOutlet para navegação
  templateUrl: './app.component.html', // Arquivo HTML do componente
  styleUrl: './app.component.scss' // Arquivo de estilos do componente
})
export class AppComponent {
  title = 'Notifica-FrontEnd'; // Título da aplicação
}
