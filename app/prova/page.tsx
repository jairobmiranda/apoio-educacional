'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProvaStorage } from '@/lib/hooks/useProvaStorage';

export default function ProvaPage() {
  const router = useRouter();
  const { aluno, setAluno } = useProvaStorage();
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  // Se já tem nome salvo, redireciona para a espera
  useEffect(() => {
    if (aluno) {
      router.push('/prova/espera');
    }
  }, [aluno, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (nome.trim().length < 3) {
      setErro('O nome deve ter no mínimo 3 caracteres');
      return;
    }

    setAluno(nome.trim());
    router.push('/prova/espera');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <div className="mb-3 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Identificação</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Insira seu nome completo para iniciar a prova
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-neutral-700"
              >
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
                placeholder="Digite seu nome completo"
                autoFocus
                required
              />
              {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
            >
              Iniciar
            </button>
          </form>

          {/* Info adicional */}
          <div className="mt-6 rounded-lg bg-neutral-50 p-4">
            <p className="text-xs leading-relaxed text-neutral-600">
              <strong className="font-medium text-neutral-900">Importante:</strong> Certifique-se de que
              seu nome está escrito corretamente. Ele será usado para identificar sua prova.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
