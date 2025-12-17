import { WeatherIcon } from './WeatherIcon';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  onQuickSearch?: (city: string) => void;
}

const QUICK_SEARCH_CITIES = [
  'Sao Paulo',
  'Rio de Janeiro',
  'Curitiba',
  'Brasilia',
];

export function EmptyState({ onQuickSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 animate-fade-in-up">
      {/* Animated weather icons */}
      <div className="relative w-32 h-32 mb-6">
        {/* Sun behind */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <WeatherIcon condition="sun" className="w-24 h-24" animated />
        </div>
        {/* Cloud in front */}
        <div className="absolute inset-0 flex items-center justify-center translate-x-2 translate-y-2">
          <WeatherIcon condition="cloud" className="w-20 h-20" animated />
        </div>
      </div>

      {/* Text content */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
        Descubra o clima
      </h2>
      <p className="text-white/60 text-center max-w-md mb-8">
        Digite o nome de uma cidade para ver a previsão do tempo atual e dos proximos 5 dias
      </p>

      {/* Quick search buttons */}
      {onQuickSearch && (
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-sm text-white/40 mr-2 self-center">
            Sugestoes:
          </span>
          {QUICK_SEARCH_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => onQuickSearch(city)}
              className={cn(
                'px-4 py-2',
                'text-sm font-medium text-white/80',
                'bg-white/10 hover:bg-white/20',
                'rounded-full',
                'border border-white/10 hover:border-white/30',
                'transition-all duration-200',
                'hover:scale-105 active:scale-95'
              )}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
