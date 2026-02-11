'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { shuffleWithSeed } from '@/lib/utils';
import type { LetraAlternativa } from '@/lib/types';

interface QuestaoItemProps {
  numero: string;
  resposta: string | undefined;
  onChange: (letra: string) => void;
  seed: number;
}

const ALTERNATIVAS: LetraAlternativa[] = ['a', 'b', 'c', 'd', 'e'];

export function QuestaoItem({ numero, resposta, onChange, seed }: QuestaoItemProps) {
  // Embaralhar alternativas de forma determinística
  const alternativasEmbaralhadas = useMemo(() => {
    return shuffleWithSeed(ALTERNATIVAS, seed + parseInt(numero));
  }, [seed, numero]);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
          {numero}
        </span>
        {resposta && (
          <span className="ml-auto text-xs font-medium text-green-600">✓ Respondida</span>
        )}
      </div>

      <div className="space-y-2">
        {alternativasEmbaralhadas.map((letra) => (
          <button
            key={letra}
            onClick={() => onChange(letra)}
            className={cn(
              'w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all',
              resposta === letra
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
            )}
          >
            <span className="uppercase">{letra})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
