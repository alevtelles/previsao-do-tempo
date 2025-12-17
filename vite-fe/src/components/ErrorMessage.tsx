import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 p-6',
        'bg-red-500/10 backdrop-blur-md',
        'border border-red-400/30',
        'rounded-2xl',
        'animate-scale-in'
      )}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-300" />
        <p className="text-red-200 font-medium">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'flex items-center gap-2',
            'px-4 py-2',
            'bg-white/10 hover:bg-white/20',
            'text-white/80 text-sm font-medium',
            'rounded-xl',
            'border border-white/10',
            'transition-all duration-200',
            'hover:scale-105 active:scale-95'
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
