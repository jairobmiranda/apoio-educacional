import { type ClassValue, clsx } from 'clsx';

/**
 * Merge de classes CSS com suporte a condicionais
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Gera um número seed a partir de uma string
 * Usado para randomização determinística
 */
export function seedRandom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Classe para geração de números aleatórios com seed
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

/**
 * Embaralha um array usando um seed para resultados determinísticos
 */
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rng = new SeededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Formata segundos em formato MM:SS ou HH:MM:SS
 */
export function formatTime(segundos: number): string {
  if (segundos < 0) return '00:00';

  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;

  if (horas > 0) {
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  }

  return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
}

/**
 * Formata data em formato brasileiro DD/MM/YYYY HH:MM
 */
export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

/**
 * Calcula a diferença em segundos entre duas datas
 */
export function getDiferencaSegundos(dataFutura: string, dataAtual: string): number {
  const futuro = new Date(dataFutura).getTime();
  const atual = new Date(dataAtual).getTime();
  return Math.max(0, Math.floor((futuro - atual) / 1000));
}
