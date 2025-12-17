export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: 'sun' | 'cloud' | 'rain';
  description: string;
}

export interface CurrentWeather {
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: 'sun' | 'cloud' | 'rain';
  description: string;
}

export interface WeatherResponse {
  city: string;
  country: string;
  current: CurrentWeather;
  forecast: DailyForecast[];
}

export interface WeatherError {
  error: string;
  message: string;
}
