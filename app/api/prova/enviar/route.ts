import { NextResponse } from 'next/server';
import { provaEnvioSchema, resultadoProvaSchema } from '@/lib/schemas';
import type { EnvioProvaRequest, ResultadoProva } from '@/lib/types';

/**
 * POST /api/prova/enviar
 * Recebe as respostas da prova e retorna o resultado
 */
export async function POST(request: Request) {
  try {
    const body: EnvioProvaRequest = await request.json();

    // Validar dados recebidos
    const validated = provaEnvioSchema.parse(body);

    // TODO: Substituir por lógica real de correção
    // Mock: gabarito fixo para demonstração
    const gabarito: Record<string, string> = {
      '01': 'a', '02': 'b', '03': 'c', '04': 'd', '05': 'e',
      '06': 'a', '07': 'b', '08': 'c', '09': 'd', '10': 'e',
      '11': 'a', '12': 'b', '13': 'c', '14': 'd', '15': 'e',
      '16': 'a', '17': 'b', '18': 'c', '19': 'd', '20': 'e',
    };

    // Corrigir prova
    const detalhes = validated.respostas.map((resposta) => {
      const respostaCorreta = gabarito[resposta.questao] || 'a';
      const correta = resposta.resposta.toLowerCase() === respostaCorreta.toLowerCase();

      return {
        questao: resposta.questao,
        respostaSelecionada: resposta.resposta.toLowerCase(),
        respostaCorreta,
        notaObtida: correta ? 1 : 0,
        correta,
      };
    });

    const notaFinal = detalhes.reduce((soma, d) => soma + d.notaObtida, 0);

    const resultado: ResultadoProva = {
      aluno: validated.aluno,
      dataRegistro: new Date().toISOString(),
      notaFinal,
      totalQuestoes: Object.keys(gabarito).length,
      detalhes,
    };

    // Validar resposta
    const validatedResult = resultadoProvaSchema.parse(resultado);

    // TODO: Salvar resultado no banco de dados

    return NextResponse.json(validatedResult);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error },
        { status: 400 }
      );
    }

    console.error('Erro ao enviar prova:', error);
    return NextResponse.json(
      { error: 'Erro ao processar envio da prova' },
      { status: 500 }
    );
  }
}
