import { NextResponse } from 'next/server';
import { questoesResponseSchema } from '@/lib/schemas';

/**
 * GET /api/prova/questoes
 * Retorna a lista de questões da prova
 */
export async function GET() {
  try {
    // TODO: Substituir por lógica real de busca de questões do banco de dados
    // Mock: 20 questões
    const questoes = Array.from({ length: 20 }, (_, i) => ({
      numero: String(i + 1).padStart(2, '0'),
    }));

    const response = {
      questoes,
      totalQuestoes: questoes.length,
    };

    // Validar resposta
    const validated = questoesResponseSchema.parse(response);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar questões' },
      { status: 500 }
    );
  }
}
