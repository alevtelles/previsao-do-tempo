import axios, { AxiosError } from 'axios';
import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
} from '../types/weather.types.js';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class OpenWeatherApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public isNotFound: boolean = false
  ) {
    super(message);
    this.name = 'OpenWeatherApiError';
  }
}

function getApiKey(): string {
  const apiKey = process.env['OPENWEATHER_API_KEY'];
  if (!apiKey) {
    throw new OpenWeatherApiError('OPENWEATHER_API_KEY not configured', 500);
  }
  return apiKey;
}

function handleApiError(error: unknown, city: string): never {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      throw new OpenWeatherApiError(`Cidade "${city}" não encontrada`, 404, true);
    }
    if (error.response?.status === 401) {
      throw new OpenWeatherApiError('Erro de autenticação com o serviço de clima', 500);
    }
    throw new OpenWeatherApiError('Erro ao comunicar com o serviço de clima', 500);
  }
  throw new OpenWeatherApiError('Erro interno ao buscar dados de clima', 500);
}

export async function fetchCurrentWeather(city: string): Promise<OpenWeatherCurrentResponse> {
  const apiKey = getApiKey();

  try {
    const response = await axios.get<OpenWeatherCurrentResponse>(`${API_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
        lang: 'pt_br',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, city);
  }
}

export async function fetchForecast(city: string): Promise<OpenWeatherForecastResponse> {
  const apiKey = getApiKey();

  try {
    const response = await axios.get<OpenWeatherForecastResponse>(`${API_BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
        lang: 'pt_br',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, city);
  }
}
