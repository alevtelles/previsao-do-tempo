import { useState } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getWeather, isWeatherError } from '@/services/weather.service';
import { cn } from '@/lib/utils';
import type { WeatherResponse } from '@/types/weather.types';

type WeatherCondition = 'sun' | 'cloud' | 'rain';

function getBackgroundClass(condition: WeatherCondition | null): string {
  switch (condition) {
    case 'sun':
      return 'weather-bg-sun';
    case 'cloud':
      return 'weather-bg-cloud';
    case 'rain':
      return 'weather-bg-rain';
    default:
      return 'bg-gradient-to-b from-sky-500 via-sky-400 to-sky-300';
  }
}

function App() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<string>('');

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);
    setLastSearch(city);

    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      if (isWeatherError(err)) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao buscar dados do clima. Verifique se o servidor esta rodando.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastSearch) {
      handleSearch(lastSearch);
    }
  };

  const currentCondition = weather?.current.condition || null;
  const bgClass = getBackgroundClass(currentCondition);

  return (
    <div
      className={cn(
        'min-h-screen transition-all duration-1000 ease-out',
        bgClass
      )}
    >
      {/* Overlay for better readability */}
      <div className="min-h-screen bg-lienar-to-b from-black/10 via-transparent to-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <header className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Previsão do Tempo
            </h1>
            <p className="text-white/70 text-base sm:text-lg">
              Consulte o clima em qualquer cidade do mundo
            </p>
          </header>

          {/* Search Form */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Content Area */}
          <main>
            {/* Loading State */}
            {isLoading && <LoadingSkeleton />}

            {/* Error State */}
            {error && !isLoading && (
              <ErrorMessage message={error} onRetry={handleRetry} />
            )}

            {/* Weather Data */}
            {weather && !isLoading && !error && (
              <div className="space-y-8">
                {/* Current Weather */}
                <CurrentWeatherCard
                  city={weather.city}
                  country={weather.country}
                  weather={weather.current}
                />

                {/* Forecast Section */}
                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-white/90 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-white/50 rounded-full" />
                    Proximos {weather.forecast.length} dias
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                    {weather.forecast.map((day, index) => (
                      <ForecastCard
                        key={day.date}
                        forecast={day}
                        index={index}
                        isToday={index === 0}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Empty State */}
            {!weather && !error && !isLoading && (
              <EmptyState onQuickSearch={handleSearch} />
            )}
          </main>

          {/* Footer */}
          <footer className="mt-12 sm:mt-16 text-center">
            <p className="text-white/40 text-sm">
              Dados fornecidos pela API de clima
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
