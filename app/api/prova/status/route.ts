import { NextResponse } from 'next/server';
import { statusProvaSchema } from '@/lib/schemas';

/**
 * GET /api/prova/status
 * Retorna o status da prova: quando será liberada e tempo restante
 * Busca os dados de https://sisnet-api.jbmiranda.ddns.net/avaliacao
 */
export async function GET() {
  try {
    // Horário do servidor (sempre usar isso como referência)
    const horaServidor = new Date();

    // Buscar dados da avaliação
    const avaliacaoResponse = await fetch('https://sisnet-api.jbmiranda.ddns.net/avaliacao');
    
    if (!avaliacaoResponse.ok) {
      throw new Error(`Erro ao buscar avaliação: ${avaliacaoResponse.status}`);
    }

    const avaliacaoData = await avaliacaoResponse.json();
    
    // Extrair data de liberação
    const liberadaEm = new Date(avaliacaoData.liberadaEm || avaliacaoData.dataLiberacao);
    
    // Calcular tempo restante
    const tempoRestanteMs = liberadaEm.getTime() - horaServidor.getTime();
    const tempoRestanteSegundos = Math.max(0, Math.floor(tempoRestanteMs / 1000));

    const response = {
      liberadaEm: liberadaEm.toISOString(),
      tempoRestanteSegundos,
      horaServidor: horaServidor.toISOString(),
    };

    // Validar resposta
    const validated = statusProvaSchema.parse(response);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Erro ao buscar status da prova:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar status da prova' },
      { status: 500 }
    );
  }
}
