import axios from 'axios';
import type { WeatherResponse, WeatherError } from '@/types/weather.types';

const API_BASE_URL = 'http://localhost:3001/api';

export async function getWeather(city: string): Promise<WeatherResponse> {
  const response = await axios.get<WeatherResponse>(`${API_BASE_URL}/weather`, {
    params: { city },
  });
  return response.data;
}

export function isWeatherError(error: unknown): error is { response: { data: WeatherError } } {
  return (
    axios.isAxiosError(error) &&
    error.response !== undefined &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data
  );
}
