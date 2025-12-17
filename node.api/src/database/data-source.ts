import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SearchLog } from '../entities/SearchLog.entity.js';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'weather.db',
  synchronize: true,
  logging: false,
  entities: [SearchLog],
});

export async function initializeDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
