import { Andar } from "./enums/andar.enum";
import { Usuarios } from "./usuarios";
import { Curso } from "./curso";

export class Sala {
  id!: number;
  numero!: number;
  andar!: Andar;
  curso!: Curso;
  alunos: Usuarios[] = [];      // todos usuários com role ALUNO
  professores: Usuarios[] = [];
}
