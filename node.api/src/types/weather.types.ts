export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherCurrentResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
}

export interface OpenWeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

export interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: OpenWeatherForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DailyForecast {
  date: string;
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
  current: {
    temp: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    windSpeed: number;
    condition: 'sun' | 'cloud' | 'rain';
    description: string;
  };
  forecast: DailyForecast[];
}
