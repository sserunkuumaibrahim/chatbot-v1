import express from 'express';
import axios from 'axios';
import { pgPool, redisClient, rabbitChannel } from '../services/database';
import { ML_SERVICE_URL } from '../config';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ChatBot SaaS Platform API' });
});

router.get('/health-check', async (req, res) => {
  try {
    // Check all connections
    if (!mongoose.connection.db) {
      throw new Error('MongoDB is not connected');
    }
    await mongoose.connection.db.admin().ping();
    if (!pgPool) throw new Error('PostgreSQL is not connected');
    await pgPool.query('SELECT NOW()');
    if (!redisClient) throw new Error('Redis is not connected');
    await redisClient.ping();
    if (!rabbitChannel) throw new Error('RabbitMQ is not connected');
    await rabbitChannel.checkQueue('test_queue');
    
    res.json({ status: 'healthy', message: 'All services are connected and functioning.' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

router.get('/ml-predict', async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/predict`);
    res.json(mlResponse.data);
  } catch (error) {
    console.error('ML service error:', error);
    res.status(500).json({ 
      message: 'Failed to get ML prediction', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;