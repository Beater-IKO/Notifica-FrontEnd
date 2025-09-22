import { Sala } from "./sala";

// Classe que representa um curso da faculdade
export class Curso {
  id!: number; // ID único do curso
  nome!: string; // Nome do curso (ex: Engenharia, Administração)
  duracao!: number; // Duração do curso em semestres
  sala!: Sala; // Sala principal do curso
}
