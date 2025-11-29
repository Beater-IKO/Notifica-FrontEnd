import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CriacaoTicketsComponent } from './components/criacao-tickets/criacao-tickets.component';
import { AndamentosComponent } from './components/andamentos/andamentos.component';
import { FinalizadosComponent } from './components/finalizados/finalizados.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        CriacaoTicketsComponent,
        AndamentosComponent,
        FinalizadosComponent,
        HistoricoComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }