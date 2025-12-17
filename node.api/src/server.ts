import 'reflect-metadata';
import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { weatherRoutes } from './routes/weather.routes.js';
import { initializeDatabase } from './database/data-source.js';

const fastify = Fastify({
  logger: true,
});

async function start(): Promise<void> {
  try {
    await initializeDatabase();

    await fastify.register(cors, {
      origin: true,
    });

    await fastify.register(weatherRoutes, { prefix: '/api' });

    fastify.get('/health', async () => {
      return { status: 'ok' };
    });

    const port = Number(process.env['PORT']) || 3001;

    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
