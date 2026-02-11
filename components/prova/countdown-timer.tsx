'use client';

import { useEffect, useState } from 'react';
import { getDiferencaSegundos } from '@/lib/utils';

interface CountdownTimerProps {
  targetTime: string;
  serverTime: string;
  onComplete: () => void;
}

export function CountdownTimer({ targetTime, serverTime, onComplete }: CountdownTimerProps) {
  const [tempoRestante, setTempoRestante] = useState<number>(() =>
    getDiferencaSegundos(targetTime, serverTime)
  );

  useEffect(() => {
    if (tempoRestante <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        const novo = prev - 1;
        if (novo <= 0) {
          clearInterval(interval);
          setTimeout(onComplete, 100);
          return 0;
        }
        return novo;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoRestante, onComplete]);

  const horas = Math.floor(tempoRestante / 3600);
  const minutos = Math.floor((tempoRestante % 3600) / 60);
  const segundos = tempoRestante % 60;

  return (
    <div className="flex items-center justify-center gap-2 text-6xl font-bold tabular-nums text-neutral-900">
      {horas > 0 && (
        <>
          <span className="flex min-w-[5rem] justify-center rounded-lg bg-neutral-100 px-4 py-3">
            {String(horas).padStart(2, '0')}
          </span>
          <span className="text-neutral-400">:</span>
        </>
      )}
      <span className="flex min-w-[5rem] justify-center rounded-lg bg-neutral-100 px-4 py-3">
        {String(minutos).padStart(2, '0')}
      </span>
      <span className="text-neutral-400">:</span>
      <span className="flex min-w-[5rem] justify-center rounded-lg bg-neutral-100 px-4 py-3">
        {String(segundos).padStart(2, '0')}
      </span>
    </div>
  );
}
