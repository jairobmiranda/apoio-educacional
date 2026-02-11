'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import type { ResultadoProva } from '@/lib/types';

interface ResultadoCardProps {
  resultado: ResultadoProva;
}

export function ResultadoCard({ resultado }: ResultadoCardProps) {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const percentual = Math.round((resultado.notaFinal / resultado.totalQuestoes) * 100);

  return (
    <div className="w-full max-w-2xl animate-[fadeIn_0.5s_ease-in] rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Prova Finalizada</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {formatDateTime(resultado.dataRegistro)}
        </p>
        <p className="mt-1 text-lg font-medium text-neutral-900">{resultado.aluno}</p>
      </div>

      {/* Nota em destaque */}
      <div className="my-8 flex flex-col items-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          {/* Círculo de fundo */}
          <svg className="absolute h-full w-full -rotate-90 transform">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-neutral-100"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentual / 100)}`}
              className={cn(
                'transition-all duration-1000',
                percentual >= 70 ? 'text-green-600' : percentual >= 50 ? 'text-yellow-600' : 'text-red-600'
              )}
              strokeLinecap="round"
            />
          </svg>

          {/* Texto central */}
          <div className="text-center">
            <div className="text-4xl font-bold text-neutral-900">
              {resultado.notaFinal}
              <span className="text-2xl text-neutral-400">/{resultado.totalQuestoes}</span>
            </div>
            <div className="mt-1 text-sm font-medium text-neutral-600">{percentual}%</div>
          </div>
        </div>

        <p className="mt-4 text-sm text-neutral-600">
          {percentual >= 70 ? 'Excelente resultado!' : percentual >= 50 ? 'Bom resultado!' : 'Continue estudando!'}
        </p>
      </div>

      {/* Botão para mostrar detalhes */}
      <button
        onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
      >
        {mostrarDetalhes ? '▲ Ocultar detalhes' : '▼ Ver detalhes das questões'}
      </button>

      {/* Detalhes colapsáveis */}
      {mostrarDetalhes && (
        <div className="mt-4 space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-3 text-sm font-medium text-neutral-900">Resultado por questão:</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {resultado.detalhes.map((detalhe) => (
              <div
                key={detalhe.questao}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold',
                  detalhe.correta
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                )}
                title={`Questão ${detalhe.questao}: ${detalhe.correta ? 'Correta' : 'Incorreta'}`}
              >
                {detalhe.questao}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
