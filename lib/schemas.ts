import { z } from 'zod';

export const respostaSchema = z.object({
  questao: z.string().min(1),
  resposta: z.string().regex(/^[a-e]$/i, 'Resposta deve ser entre a-e'),
});

export const provaEnvioSchema = z.object({
  aluno: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  respostas: z.array(respostaSchema).min(1, 'Deve ter pelo menos uma resposta'),
});

export const statusProvaSchema = z.object({
  liberadaEm: z.string().datetime(),
  tempoRestanteSegundos: z.number().int().min(0),
  horaServidor: z.string().datetime(),
});

export const questaoSchema = z.object({
  numero: z.string().min(1),
  enunciado: z.string().optional(),
});

export const questoesResponseSchema = z.object({
  questoes: z.array(questaoSchema),
  totalQuestoes: z.number().int().positive(),
});

export const verificarEnvioSchema = z.object({
  podeEnviar: z.boolean(),
  motivo: z.string().optional(),
});

export const detalheQuestaoSchema = z.object({
  questao: z.string(),
  respostaSelecionada: z.string(),
  respostaCorreta: z.string(),
  notaObtida: z.number(),
  correta: z.boolean(),
});

export const resultadoProvaSchema = z.object({
  aluno: z.string(),
  dataRegistro: z.string().datetime(),
  notaFinal: z.number(),
  totalQuestoes: z.number().int().positive(),
  detalhes: z.array(detalheQuestaoSchema),
});
