'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalConfirmacaoProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}

export function ModalConfirmacao({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'default',
}: ModalConfirmacaoProps) {
  // Gerenciar overflow do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity',
        isOpen ? 'opacity-100' : 'opacity-0'
      )}
      onClick={onCancel}
    >
      <div
        className={cn(
          'w-full max-w-md rounded-lg bg-white p-6 shadow-xl transition-all',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors',
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-neutral-800 hover:bg-neutral-900'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
