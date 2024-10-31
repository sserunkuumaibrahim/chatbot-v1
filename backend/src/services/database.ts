import mongoose from 'mongoose';
import { Pool } from 'pg';
import Redis from 'ioredis';
import amqp from 'amqplib';
import { MONGODB_URI, POSTGRES_URI, REDIS_URI, RABBITMQ_URI } from '../config';

export let pgPool: Pool | null = null;
export let redisClient: Redis | null = null;
export let rabbitChannel: amqp.Channel | null = null;

const connectWithRetry = async (uri: string) => {
  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      retries -= 1;
      console.log(`MongoDB connection unsuccessful, retry attempt ${5 - retries}/5`, err);
      if (retries === 0) {
        console.error('Failed to connect to MongoDB after 5 attempts');
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

export async function connectToServices() {
  try {
    // MongoDB
    await connectWithRetry(MONGODB_URI);

    // PostgreSQL
    pgPool = new Pool({ connectionString: POSTGRES_URI });
    await pgPool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL');

    // Redis
    redisClient = new Redis(REDIS_URI);
    await redisClient.ping();
    console.log('Connected to Redis');

    // RabbitMQ
    const rabbitConn = await amqp.connect(RABBITMQ_URI);
    rabbitChannel = await rabbitConn.createChannel();
    await rabbitChannel.assertQueue('test_queue');
    console.log('Connected to RabbitMQ');

  } catch (error) {
    console.error('Error connecting to services:', error);
    throw error;
  }
}

export async function closeConnections() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (pgPool) {
    await pgPool.end();
  }
  if (redisClient) {
    await redisClient.quit();
  }
  if (rabbitChannel) {
    await rabbitChannel.close();
  }
}