import { connectToServices, closeConnections } from '../services/database';

beforeAll(async () => {
  await connectToServices();
});

afterAll(async () => {
  try {
    await closeConnections();
  } catch (error: unknown) {
    if (error instanceof Error && !error.message.includes('Called end on pool more than once')) {
      throw error;
    }
  }
});