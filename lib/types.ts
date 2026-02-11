// Tipos para o sistema de provas

export interface Questao {
  numero: string;
  enunciado?: string;
}

export type LetraAlternativa = 'a' | 'b' | 'c' | 'd' | 'e';

export interface Alternativa {
  letra: LetraAlternativa;
}

export interface Resposta {
  questao: string;
  resposta: string;
}

export interface StatusProva {
  liberadaEm: string; // ISO 8601
  tempoRestanteSegundos: number;
  horaServidor: string; // ISO 8601
}

export interface DetalheQuestao {
  questao: string;
  respostaSelecionada: string;
  respostaCorreta: string;
  notaObtida: number;
  correta: boolean;
}

export interface ResultadoProva {
  aluno: string;
  dataRegistro: string; // ISO 8601
  notaFinal: number;
  totalQuestoes: number;
  detalhes: DetalheQuestao[];
}

export interface QuestoesResponse {
  questoes: Questao[];
  totalQuestoes: number;
}

export interface VerificarEnvioResponse {
  podeEnviar: boolean;
  motivo?: string;
}

export interface EnvioProvaRequest {
  aluno: string;
  respostas: Resposta[];
}

export interface ProvaStorage {
  aluno: string | null;
  respostas: Record<string, string>; // questao -> resposta
  resultado: ResultadoProva | null;
}
