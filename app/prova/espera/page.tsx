'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProvaStorage } from '@/lib/hooks/useProvaStorage';
import { CountdownTimer } from '@/components/prova/countdown-timer';
import { LoadingSpinner } from '@/components/prova/loading-spinner';
import { ErrorMessage } from '@/components/prova/error-message';
import { formatDateTime } from '@/lib/utils';
import type { StatusProva } from '@/lib/types';

export default function EsperaPage() {
  const router = useRouter();
  const { aluno } = useProvaStorage();
  const [status, setStatus] = useState<StatusProva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar se aluno está identificado
  useEffect(() => {
    if (!aluno) {
      router.push('/prova');
    }
  }, [aluno, router]);

  // Buscar status da prova
  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/prova/status');
        if (!response.ok) {
          throw new Error('Erro ao buscar status da prova');
        }
        const data: StatusProva = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  const handleComplete = () => {
    // Redirecionar para a prova
    window.location.href = '/prova/realizar';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md">
          <ErrorMessage message={error} />
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  // Se já passou do horário, libera imediatamente
  if (status.tempoRestanteSegundos === 0) {
    handleComplete();
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-3xl text-center">
        {/* Nome do aluno */}
        <div className="mb-8">
          <p className="text-sm font-medium text-neutral-600">Bem-vindo(a),</p>
          <h2 className="mt-1 text-2xl font-bold text-neutral-900">{aluno}</h2>
        </div>

        {/* Card principal */}
        <div className="rounded-xl border border-neutral-200 bg-white p-12 shadow-lg">
          <div className="mb-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                <svg
                  className="h-10 w-10 text-neutral-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">A prova será liberada em:</h1>
            <p className="mt-3 text-lg text-neutral-600">
              {formatDateTime(status.liberadaEm)}
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-8">
            <CountdownTimer
              targetTime={status.liberadaEm}
              serverTime={status.horaServidor}
              onComplete={handleComplete}
            />
          </div>

          {/* Mensagem */}
          <div className="rounded-lg bg-neutral-50 p-6">
            <p className="text-sm leading-relaxed text-neutral-700">
              <strong className="font-semibold">Aguarde...</strong> A página será recarregada
              automaticamente quando a prova for liberada.
            </p>
          </div>
        </div>

        {/* Instruções adicionais */}
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6 text-left">
          <h3 className="mb-3 font-semibold text-neutral-900">Instruções importantes:</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Certifique-se de que tem uma conexão estável com a internet</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Suas respostas serão salvas automaticamente enquanto você preenche</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Leia atentamente cada questão antes de responder</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Não feche esta janela até o início da prova</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
