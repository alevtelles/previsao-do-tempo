import { MapPin, Droplets, Wind, Thermometer, Eye } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { cn } from '@/lib/utils';
import type { CurrentWeather } from '@/types/weather.types';

interface CurrentWeatherCardProps {
  city: string;
  country: string;
  weather: CurrentWeather;
}

function getTemperatureColor(temp: number): string {
  if (temp < 10) return 'text-blue-300';
  if (temp < 18) return 'text-cyan-300';
  if (temp < 24) return 'text-emerald-300';
  if (temp < 30) return 'text-amber-300';
  return 'text-orange-300';
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}

function StatCard({ icon, label, value, delay = 0 }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 p-4',
        'bg-white/10 backdrop-blur-sm',
        'rounded-2xl',
        'transition-all duration-300',
        'hover:bg-white/20 hover:scale-105',
        'animate-fade-in-up opacity-0'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="text-white/70">{icon}</div>
      <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
        {label}
      </span>
      <span className="text-lg font-bold text-white">{value}</span>
    </div>
  );
}

export function CurrentWeatherCard({ city, country, weather }: CurrentWeatherCardProps) {
  const tempColor = getTemperatureColor(weather.temp);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'rounded-3xl',
        'bg-white/15 backdrop-blur-xl',
        'border border-white/20',
        'shadow-2xl shadow-black/10',
        'p-6 sm:p-8',
        'animate-scale-in'
      )}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header - Location */}
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-white/70" />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            {city}, {country}
          </h2>
        </div>
        <p className="text-white/70 capitalize text-sm sm:text-base mb-6">
          {weather.description}
        </p>

        {/* Main weather display */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          {/* Weather icon - large and animated */}
          <div className="flex-shrink-0">
            <WeatherIcon
              condition={weather.condition}
              className="w-28 h-28 sm:w-36 sm:h-36"
              animated
            />
          </div>

          {/* Temperature display */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-start justify-center sm:justify-start">
              <span
                className={cn(
                  'text-7xl sm:text-8xl lg:text-9xl font-extralight tracking-tighter',
                  tempColor
                )}
              >
                {weather.temp}
              </span>
              <span className={cn('text-3xl sm:text-4xl font-light mt-2', tempColor)}>
                °C
              </span>
            </div>

            {/* Min/Max temperatures */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
              <div className="flex items-center gap-1 text-white/80">
                <span className="text-xs uppercase tracking-wide text-white/50">Min</span>
                <span className="font-medium">{weather.tempMin}°</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-1 text-white/80">
                <span className="text-xs uppercase tracking-wide text-white/50">Max</span>
                <span className="font-medium">{weather.tempMax}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Droplets className="w-5 h-5" />}
            label="Umidade"
            value={`${weather.humidity}%`}
            delay={100}
          />
          <StatCard
            icon={<Wind className="w-5 h-5" />}
            label="Vento"
            value={`${weather.windSpeed} m/s`}
            delay={150}
          />
          <StatCard
            icon={<Thermometer className="w-5 h-5" />}
            label="Sensacao"
            value={`${weather.temp}°C`}
            delay={200}
          />
          <StatCard
            icon={<Eye className="w-5 h-5" />}
            label="Visibilidade"
            value="10 km"
            delay={250}
          />
        </div>
      </div>
    </div>
  );
}
