'use client';

import { useState, useCallback } from 'react';
import type { ResultadoProva } from '@/lib/types';

const STORAGE_KEYS = {
  ALUNO: 'prova:aluno',
  RESPOSTAS: 'prova:respostas',
  RESULTADO: 'prova:resultado',
} as const;

interface UseProvaStorageReturn {
  aluno: string | null;
  respostas: Record<string, string>;
  resultado: ResultadoProva | null;
  setAluno: (nome: string) => void;
  saveResposta: (questao: string, resposta: string) => void;
  saveResultado: (resultado: ResultadoProva) => void;
  clearData: () => void;
  clearRespostas: () => void;
}

/**
 * Hook para gerenciar o localStorage da prova
 */
export function useProvaStorage(): UseProvaStorageReturn {
  // Lazy initialization - carrega do localStorage apenas uma vez
  const [aluno, setAlunoState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ALUNO);
  });

  const [respostas, setRespostasState] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(STORAGE_KEYS.RESPOSTAS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar respostas:', error);
      }
    }
    return {};
  });

  const [resultado, setResultadoState] = useState<ResultadoProva | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(STORAGE_KEYS.RESULTADO);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar resultado:', error);
      }
    }
    return null;
  });

  const setAluno = useCallback((nome: string) => {
    setAlunoState(nome);
    localStorage.setItem(STORAGE_KEYS.ALUNO, nome);
  }, []);

  const saveResposta = useCallback((questao: string, resposta: string) => {
    setRespostasState((prev) => {
      const novasRespostas = { ...prev, [questao]: resposta };
      localStorage.setItem(STORAGE_KEYS.RESPOSTAS, JSON.stringify(novasRespostas));
      return novasRespostas;
    });
  }, []);

  const saveResultado = useCallback((resultado: ResultadoProva) => {
    setResultadoState(resultado);
    localStorage.setItem(STORAGE_KEYS.RESULTADO, JSON.stringify(resultado));
  }, []);

  const clearRespostas = useCallback(() => {
    setRespostasState({});
    localStorage.removeItem(STORAGE_KEYS.RESPOSTAS);
  }, []);

  const clearData = useCallback(() => {
    setAlunoState(null);
    setRespostasState({});
    setResultadoState(null);
    localStorage.removeItem(STORAGE_KEYS.ALUNO);
    localStorage.removeItem(STORAGE_KEYS.RESPOSTAS);
    localStorage.removeItem(STORAGE_KEYS.RESULTADO);
  }, []);

  return {
    aluno,
    respostas,
    resultado,
    setAluno,
    saveResposta,
    saveResultado,
    clearData,
    clearRespostas,
  };
}
