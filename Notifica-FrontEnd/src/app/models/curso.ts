import { Sala } from "./sala";

export class Curso {
  id!: number;
  nome!: string;
  duracao!: number;
  sala!: Sala;
}
