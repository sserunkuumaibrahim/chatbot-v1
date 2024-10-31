import express from 'express';

export const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the ChatBot SaaS Platform API' });
});

app.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/ml-predict', (req, res) => {
  // Implement your ML prediction logic here
  res.status(200).json({ prediction: 'Sample prediction' });
});