import { Ticket } from "../model/ticket";
import { Role } from "./enums/role.enum";
import { Sala } from "./sala";

// Classe que representa um usuário do sistema
export class Usuario {

  id!: number; // ID único do usuário
  nome!: string; // Nome completo
  cpf!: string; // CPF do usuário
  email!: string; // Email para contato
  senha!: string; // Senha para login
  role!: Role; // Cargo do usuário (admin, estudante, etc)
  sala?: Sala | null; // Sala que o usuário frequenta (opcional)
  tickets!: Ticket[]; // Lista de tickets criados pelo usuário

}
