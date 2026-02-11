import { NextResponse } from 'next/server';
import { verificarEnvioSchema } from '@/lib/schemas';

/**
 * GET /api/prova/verificar-envio
 * Verifica se a prova pode ser enviada
 */
export async function GET() {
  try {
    // TODO: Substituir por lógica real de verificação
    // Verificar se o tempo de prova ainda não expirou
    // Verificar se o aluno já não enviou a prova antes
    
    const response = {
      podeEnviar: true,
      motivo: 'Prova disponível para envio',
    };

    // Validar resposta
    const validated = verificarEnvioSchema.parse(response);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Erro ao verificar envio:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar disponibilidade de envio' },
      { status: 500 }
    );
  }
}
