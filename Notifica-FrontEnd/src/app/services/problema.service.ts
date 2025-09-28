import { Injectable } from '@angular/core';

export interface TipoProblema {
  nome: string;
  subtipos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProblemaService {
  
  private tipoProblemas: TipoProblema[] = [
    {
      nome: 'Ar Condicionado',
      subtipos: ['Não liga', 'Não gela', 'Vazamento', 'Ruído excessivo', 'Controle não funciona']
    },
    {
      nome: 'Elétrica',
      subtipos: ['Tomada não funciona', 'Lâmpada queimada', 'Disjuntor desarmado', 'Falta de energia']
    },
    {
      nome: 'Hidráulica',
      subtipos: ['Vazamento', 'Entupimento', 'Torneira quebrada', 'Vaso sanitário com problema']
    },
    {
      nome: 'Mobiliário',
      subtipos: ['Mesa quebrada', 'Cadeira com defeito', 'Armário danificado', 'Gaveta emperrada']
    }
  ];

  private salas = ['Sala 101', 'Sala 102', 'Sala 201', 'Sala 202', 'Laboratório 1', 'Laboratório 2'];

  getTipoProblemas(): TipoProblema[] {
    return this.tipoProblemas;
  }

  getSalas(): string[] {
    return this.salas;
  }

  getSubtiposPorTipo(tipoNome: string): string[] {
    const tipo = this.tipoProblemas.find(t => t.nome === tipoNome);
    return tipo ? tipo.subtipos : [];
  }
}