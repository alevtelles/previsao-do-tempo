import type { FastifyRequest, FastifyReply } from 'fastify';
import { getWeatherByCity } from '../services/weather.service.js';
import { OpenWeatherApiError } from '../clients/openweather.client.js';

interface WeatherQuery {
  city: string;
}

const MAX_CITY_LENGTH = 100;
const MIN_CITY_LENGTH = 2;

function sanitizeCity(city: string): string {
  return city
    .trim()
    .replace(/[<>\"'&;]/g, '')
    .substring(0, MAX_CITY_LENGTH);
}

function validateCity(city: unknown): { valid: boolean; error?: string; sanitized?: string } {
  if (!city || typeof city !== 'string') {
    return { valid: false, error: 'O parâmetro "city" é obrigatório' };
  }

  const sanitized = sanitizeCity(city);

  if (sanitized.length < MIN_CITY_LENGTH) {
    return { valid: false, error: `O nome da cidade deve ter pelo menos ${MIN_CITY_LENGTH} caracteres` };
  }

  if (sanitized.length > MAX_CITY_LENGTH) {
    return { valid: false, error: `O nome da cidade não pode exceder ${MAX_CITY_LENGTH} caracteres` };
  }

  if (!/^[\p{L}\p{M}\s\-'.]+$/u.test(sanitized)) {
    return { valid: false, error: 'O nome da cidade contém caracteres inválidos' };
  }

  return { valid: true, sanitized };
}

function getClientIp(request: FastifyRequest): string {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const firstIp = forwarded.split(',')[0];
    return firstIp?.trim() ?? request.ip;
  }
  return request.ip;
}

export async function getWeather(
  request: FastifyRequest<{ Querystring: WeatherQuery }>,
  reply: FastifyReply
): Promise<void> {
  const validation = validateCity(request.query.city);

  if (!validation.valid || !validation.sanitized) {
    reply.status(400).send({
      error: 'Bad Request',
      message: validation.error,
    });
    return;
  }

  const city = validation.sanitized;
  const ipAddress = getClientIp(request);

  try {
    const weather = await getWeatherByCity(city, ipAddress);
    reply.send(weather);
  } catch (error) {
    if (error instanceof OpenWeatherApiError) {
      const statusCode = error.isNotFound ? 404 : 500;
      reply.status(statusCode).send({
        error: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
        message: error.message,
      });
      return;
    }

    request.log.error(error);
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Erro ao buscar dados de clima',
    });
  }
}
