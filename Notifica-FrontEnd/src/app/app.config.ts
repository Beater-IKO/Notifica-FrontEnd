import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

// Configuração principal da aplicação Angular
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Otimização de performance
    provideRouter(routes), // Configura as rotas da aplicação
    provideAnimations(), // Habilita animações
    provideHttpClient() // Habilita requisições HTTP para o servidor
  ]
};