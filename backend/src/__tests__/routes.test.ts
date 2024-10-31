import request from 'supertest';
import { app } from '../app';

describe('Routes', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to the ChatBot SaaS Platform API' });
  });
});