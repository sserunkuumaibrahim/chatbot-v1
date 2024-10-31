import request from 'supertest';
import { app } from '../server';
import { connectToServices, closeConnections } from '../services/database';

describe('API Endpoints', () => {
  beforeAll(async () => {
    await connectToServices();
  });

  afterAll(async () => {
    await closeConnections();
  });

  test('GET /health-check should return healthy status', async () => {
    const response = await request(app).get('/health-check');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });

  test('GET /ml-predict should return prediction', async () => {
    const response = await request(app).get('/ml-predict').query({ input: 'test input' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('prediction');
  });
});