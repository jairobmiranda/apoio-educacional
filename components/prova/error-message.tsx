'use client';

import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800',
        className
      )}
    >
      <p className="font-medium">Erro</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}
