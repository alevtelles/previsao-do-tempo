import type { FastifyInstance } from 'fastify';
import { getWeather } from '../controllers/weather.controller.js';

export async function weatherRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/weather', getWeather);
}
