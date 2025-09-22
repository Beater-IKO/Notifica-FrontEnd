// Interface que define como deve ser um ticket no sistema
export interface Ticket {
  descricao: string; // Descrição do problema
  sala: string; // Sala onde está o problema
  area: string; // Área da faculdade (elétrica, hidráulica, etc)
  andar: string; // Andar onde fica a sala
  prioridade: string; // Nível de prioridade (leve, médio, alto, urgente)
  tipoProblema: string; // Tipo do problema (ar condicionado, elétrica, etc)
  subtipoProblema: string; // Subtipo mais específico do problema
}
