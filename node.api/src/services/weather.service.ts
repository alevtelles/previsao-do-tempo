import { fetchCurrentWeather, fetchForecast } from '../clients/openweather.client.js';
import { AppDataSource } from '../database/data-source.js';
import { SearchLog } from '../entities/SearchLog.entity.js';
import type {
  OpenWeatherForecastItem,
  WeatherResponse,
  DailyForecast,
} from '../types/weather.types.js';

function getCondition(weatherMain: string): 'sun' | 'cloud' | 'rain' {
  const main = weatherMain.toLowerCase();
  if (main.includes('rain') || main.includes('drizzle') || main.includes('thunderstorm')) {
    return 'rain';
  }
  if (main.includes('cloud') || main.includes('mist') || main.includes('fog') || main.includes('haze')) {
    return 'cloud';
  }
  return 'sun';
}

function groupForecastByDay(list: OpenWeatherForecastItem[]): Map<string, OpenWeatherForecastItem[]> {
  const grouped = new Map<string, OpenWeatherForecastItem[]>();

  for (const item of list) {
    const date = item.dt_txt.split(' ')[0];
    if (date) {
      const existing = grouped.get(date) ?? [];
      existing.push(item);
      grouped.set(date, existing);
    }
  }

  return grouped;
}

function processDailyForecast(items: OpenWeatherForecastItem[], date: string): DailyForecast {
  let tempMin = Infinity;
  let tempMax = -Infinity;
  let totalHumidity = 0;
  let totalWindSpeed = 0;
  const conditions: string[] = [];

  for (const item of items) {
    tempMin = Math.min(tempMin, item.main.temp_min);
    tempMax = Math.max(tempMax, item.main.temp_max);
    totalHumidity += item.main.humidity;
    totalWindSpeed += item.wind.speed;
    const weather = item.weather[0];
    if (weather) {
      conditions.push(weather.main);
    }
  }

  const avgHumidity = Math.round(totalHumidity / items.length);
  const avgWindSpeed = Math.round((totalWindSpeed / items.length) * 10) / 10;

  const conditionCounts = new Map<string, number>();
  for (const cond of conditions) {
    conditionCounts.set(cond, (conditionCounts.get(cond) ?? 0) + 1);
  }

  let dominantCondition = 'Clear';
  let maxCount = 0;
  for (const [cond, count] of conditionCounts) {
    if (count > maxCount) {
      maxCount = count;
      dominantCondition = cond;
    }
  }

  return {
    date,
    tempMin: Math.round(tempMin),
    tempMax: Math.round(tempMax),
    humidity: avgHumidity,
    windSpeed: avgWindSpeed,
    condition: getCondition(dominantCondition),
    description: dominantCondition,
  };
}

async function logSearch(
  city: string,
  ipAddress: string,
  success: boolean,
  cityFound?: string,
  country?: string,
  errorMessage?: string
): Promise<void> {
  try {
    const logRepository = AppDataSource.getRepository(SearchLog);
    const log = logRepository.create({
      city,
      cityFound: cityFound ?? null,
      country: country ?? null,
      success,
      errorMessage: errorMessage ?? null,
      ipAddress,
    });
    await logRepository.save(log);
  } catch (error) {
    console.error('Error saving search log:', error);
  }
}

export async function getWeatherByCity(city: string, ipAddress: string): Promise<WeatherResponse> {
  try {
    const [current, forecast] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city),
    ]);

    const groupedForecast = groupForecastByDay(forecast.list);
    const dailyForecasts: DailyForecast[] = [];

    let daysAdded = 0;

    for (const [date, items] of groupedForecast) {
      if (daysAdded < 6) {
        dailyForecasts.push(processDailyForecast(items, date));
        daysAdded++;
      }
    }

    const currentWeather = current.weather[0];

    const response: WeatherResponse = {
      city: current.name,
      country: current.sys.country,
      current: {
        temp: Math.round(current.main.temp),
        tempMin: Math.round(current.main.temp_min),
        tempMax: Math.round(current.main.temp_max),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 10) / 10,
        condition: currentWeather ? getCondition(currentWeather.main) : 'sun',
        description: currentWeather?.description ?? 'Céu limpo',
      },
      forecast: dailyForecasts,
    };

    await logSearch(city, ipAddress, true, current.name, current.sys.country);

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    await logSearch(city, ipAddress, false, undefined, undefined, errorMessage);
    throw error;
  }
}
