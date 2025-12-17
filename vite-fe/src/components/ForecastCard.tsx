import { WeatherIcon } from './WeatherIcon';
import { cn } from '@/lib/utils';
import type { DailyForecast } from '@/types/weather.types';

interface ForecastCardProps {
  forecast: DailyForecast;
  index: number;
  isToday?: boolean;
}

function formatDate(dateString: string): { day: string; weekday: string } {
  const date = new Date(dateString + 'T00:00:00');
  return {
    day: date.toLocaleDateString('pt-BR', { day: '2-digit' }),
    weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
  };
}

function getTemperatureBarWidth(tempMin: number, tempMax: number): { minPos: string; maxPos: string } {
  // Normalize temperatures to 0-100 scale (assuming range of -10 to 45)
  const normalize = (temp: number) => Math.max(0, Math.min(100, ((temp + 10) / 55) * 100));
  return {
    minPos: `${normalize(tempMin)}%`,
    maxPos: `${normalize(tempMax)}%`,
  };
}

export function ForecastCard({ forecast, index, isToday = false }: ForecastCardProps) {
  const { day, weekday } = formatDate(forecast.date);
  const { minPos, maxPos } = getTemperatureBarWidth(forecast.tempMin, forecast.tempMax);

  return (
    <div
      className={cn(
        'group relative',
        'flex flex-col items-center gap-3',
        'p-4 sm:p-5',
        'bg-white/10 backdrop-blur-md',
        'rounded-2xl',
        'border border-white/10',
        'transition-all duration-300 ease-out',
        'hover:bg-white/20 hover:border-white/30',
        'hover:scale-105 hover:shadow-lg hover:shadow-black/10',
        'animate-fade-in-up opacity-0',
        isToday && 'bg-white/20 border-white/30 ring-2 ring-white/20',
        `forecast-card-${index}`
      )}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Today badge */}
      {isToday && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-700 rounded-full">
            Hoje
          </span>
        </div>
      )}

      {/* Day of week */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
          {weekday}
        </p>
        <p className="text-lg font-bold text-white">{day}</p>
      </div>

      {/* Weather icon with hover animation */}
      <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <WeatherIcon
          condition={forecast.condition}
          className="w-12 h-12 sm:w-14 sm:h-14"
          animated
        />
      </div>

      {/* Temperatures */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Max temp */}
        <span className="text-xl font-bold text-white">
          {forecast.tempMax}°
        </span>

        {/* Temperature bar */}
        <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-400 via-emerald-400 to-orange-400 rounded-full"
            style={{
              left: minPos,
              right: `calc(100% - ${maxPos})`,
            }}
          />
        </div>

        {/* Min temp */}
        <span className="text-sm text-white/60">
          {forecast.tempMin}°
        </span>
      </div>

      {/* Additional info on hover - desktop only */}
      <div className="hidden sm:block w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-between text-xs text-white/50 pt-2 border-t border-white/10">
          <span>{forecast.humidity}%</span>
          <span>{forecast.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
}
