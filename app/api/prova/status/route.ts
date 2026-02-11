import { NextResponse } from 'next/server';
import { statusProvaSchema } from '@/lib/schemas';

/**
 * GET /api/prova/status
 * Retorna o status da prova: quando será liberada e tempo restante
 */
export async function GET() {
  try {
    // Horário do servidor (sempre usar isso como referência)
    const horaServidor = new Date().toISOString();

    // TODO: Substituir por lógica real de configuração da prova
    // Exemplo: prova liberada em 14:00 do dia atual
    const hoje = new Date();
    const liberadaEm = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0, 0);
    
    // Se já passou, libera imediatamente (para testes)
    if (liberadaEm < hoje) {
      liberadaEm.setDate(liberadaEm.getDate() + 1);
    }

    const tempoRestanteMs = liberadaEm.getTime() - hoje.getTime();
    const tempoRestanteSegundos = Math.max(0, Math.floor(tempoRestanteMs / 1000));

    const response = {
      liberadaEm: liberadaEm.toISOString(),
      tempoRestanteSegundos,
      horaServidor,
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
