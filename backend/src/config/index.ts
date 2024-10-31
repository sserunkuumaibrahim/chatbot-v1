export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot-saas';
export const POSTGRES_URI = process.env.POSTGRES_URI || 'postgresql://localhost:5432/chatbot-saas';
export const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';
export const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost';
export const ML_SERVICE_URL = 'http://ml-service:8000';