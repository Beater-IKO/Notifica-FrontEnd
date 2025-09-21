import { Ticket } from "../model/ticket";
import { Role } from "./enums/role.enum";
import { Sala } from "./sala";

export class Usuario {

  id!: number;
  nome!: string;
  cpf!: string;
  email!: string;
  senha!: string;
  role!: Role;
  sala?: Sala | null;
  tickets!: Ticket[];

}
