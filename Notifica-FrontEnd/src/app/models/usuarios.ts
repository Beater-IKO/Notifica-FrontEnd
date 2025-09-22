import { Role } from "./enums/role.enum";
import { Sala } from "./sala";

// Classe alternativa para representar usuários (similar ao Usuario.ts)
export class Usuarios {

  id!: number; // ID único do usuário
  nome!: string; // Nome completo
  cpf!: string; // CPF do usuário
  email!: string; // Email para contato
  senha!: string; // Senha para login
  userRole!: Role; // Cargo do usuário
  sala?: Sala; // Sala associada (opcional)

}
