// Lista de salas disponíveis na faculdade
export const SALAS = ['Sala 101', 'Sala 102', 'Sala 201', 'Sala 202', 'Laboratório 1', 'Laboratório 2'];

// Níveis de prioridade dos tickets
export const PRIORIDADES = ['LEVE', 'MEDIO', 'ALTO', 'URGENTE'];

// Andares da faculdade
export const ANDARES = ['1º Andar', '2º Andar', '3º Andar', '4º Andar'];

// Tipos principais de problemas
export const TIPOS = ['Ar Condicionado', 'Elétrica', 'Hidráulica', 'Mobiliário'];

// Tipos de problemas com seus subtipos específicos
export const TIPO_PROBLEMAS = [
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

// Tipos de usuário do sistema com seus rótulos
export const ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'ESTUDANTE', label: 'Estudante' },
  { value: 'PROFESSOR', label: 'Professor' },
  { value: 'FUNCIONARIO', label: 'Funcionário' },
  { value: 'GESTOR', label: 'Gestor' }
];