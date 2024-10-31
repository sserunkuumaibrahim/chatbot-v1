import mongoose from 'mongoose';
import { Pool } from 'pg';
import Redis from 'ioredis';
import amqp from 'amqplib';
import { MONGODB_URI, POSTGRES_URI, REDIS_URI, RABBITMQ_URI } from '../config';

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe('Database Connections', () => {
  beforeAll(async () => {
    // Create a connection to the default postgres database
    const setupPool = new Pool({
      connectionString: POSTGRES_URI.replace('/chatbot-saas', '/postgres')
    });
    
    try {
      // Check if database exists
      const result = await setupPool.query(
        "SELECT 1 FROM pg_database WHERE datname = 'chatbot-saas'"
      );
      
      // Create database if it doesn't exist
      if (result.rows.length === 0) {
        await setupPool.query('CREATE DATABASE "chatbot-saas"');
      }
    } finally {
      await setupPool.end();
    }
  });

  test('should connect to all databases', async () => {
    expect(mongoose.connection.readyState).toBe(1);
    
    const pgPool = new Pool({ connectionString: POSTGRES_URI });
    const pgResult = await pgPool.query('SELECT NOW()');
    expect(pgResult.rows.length).toBe(1);
    await pgPool.end();
    
    const redisClient = new Redis(REDIS_URI);
    const redisResult = await redisClient.ping();
    expect(redisResult).toBe('PONG');
    await redisClient.quit();
    
    const rabbitConn = await amqp.connect(RABBITMQ_URI);
    const channel = await rabbitConn.createChannel();
    await channel.assertQueue('test_queue');
    expect(channel).toBeDefined();
    await channel.close();
    await rabbitConn.close();
  });
});