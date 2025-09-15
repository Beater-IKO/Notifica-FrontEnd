import { Role } from "./enums/role.enum";
import { Sala } from "./sala";

export class Usuarios {

  id!: number;
  nome!: string;
  cpf!: string;
  email!: string;
  senha!: string;
  userRole!: Role;
  sala?: Sala;

}
