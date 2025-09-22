import { Andar } from "./enums/andar.enum";
import { Usuarios } from "./usuarios";
import { Curso } from "./curso";

// Classe que representa uma sala da faculdade
export class Sala {
  id!: number; // ID único da sala
  numero!: number; // Número da sala (ex: 101, 202)
  andar!: Andar; // Em que andar a sala fica
  curso!: Curso; // Curso que usa essa sala
  alunos: Usuarios[] = []; // Lista de alunos que frequentam a sala
  professores: Usuarios[] = []; // Lista de professores que dão aula na sala
}
