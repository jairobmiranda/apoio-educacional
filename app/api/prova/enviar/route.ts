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

    // Buscar gabarito da API externa
    const gabaritoUrl = 'https://mockapi.jbmiranda.vps-kinghost.net/prova-senai-1';
    const gabaritoResponse = await fetch(gabaritoUrl);
    
    if (!gabaritoResponse.ok) {
      throw new Error('Erro ao buscar gabarito da API');
    }

    const gabaritoData: Array<{
      body: {
        questao: string;
        resposta: string;
      };
    }> = await gabaritoResponse.json();

    // Construir gabarito a partir da resposta da API
    const gabarito: Record<string, string> = {};
    gabaritoData.forEach((item) => {
      gabarito[item.body.questao] = item.body.resposta.toLowerCase();
    });

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

    // Enviar resultado para webhook
    try {
      const webhookUrl = 'https://webhook.site/5401bc0a-35ce-4ba4-b534-78d64b82b52b';
      
      const webhookPayload = {
        aluno: validatedResult.aluno,
        dataRegistro: validatedResult.dataRegistro,
        notaFinal: validatedResult.notaFinal,
        totalQuestoes: validatedResult.totalQuestoes,
        alternativasMarcadas: validatedResult.detalhes.map(d => ({
          questao: d.questao,
          alternativaMarcada: d.respostaSelecionada,
          respostaCorreta: d.respostaCorreta,
          correta: d.correta,
          notaObtida: d.notaObtida,
        })),
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });
    } catch (webhookError) {
      // Log do erro mas não interrompe o fluxo
      console.error('Erro ao enviar para webhook:', webhookError);
    }

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
