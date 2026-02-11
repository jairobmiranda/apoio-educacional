'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProvaStorage } from '@/lib/hooks/useProvaStorage';
import { ResultadoCard } from '@/components/prova/resultado-card';

export default function ResultadoPage() {
  const router = useRouter();
  const { resultado, clearData } = useProvaStorage();

  // Verificar se tem resultado
  useEffect(() => {
    if (!resultado) {
      router.push('/prova');
    }
  }, [resultado, router]);

  const handleSair = () => {
    if (confirm('Tem certeza de que deseja sair? Os dados serão apagados.')) {
      clearData();
      router.push('/prova');
    }
  };

  if (!resultado) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <ResultadoCard resultado={resultado} />

      {/* Botões de ação */}
      <div className="mt-6 flex w-full max-w-2xl gap-4">
        <button
          onClick={handleSair}
          className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Sair
        </button>
      </div>

      {/* Informação adicional */}
      <div className="mt-8 w-full max-w-2xl rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-3 font-semibold text-neutral-900">Informações</h3>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex gap-2">
            <span className="text-neutral-400">•</span>
            <span>Sua prova foi enviada com sucesso e registrada no sistema</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neutral-400">•</span>
            <span>Guarde seu resultado para consultas futuras</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neutral-400">•</span>
            <span>Em caso de dúvidas, entre em contato com o responsável</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
