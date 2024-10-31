import { createServer } from 'http';
import { app } from './server';
import { connectToServices } from './services/database';
import { PORT } from './config';
export { app };

export async function startServer(port = PORT) {
  await connectToServices();
  const httpServer = createServer(app);
  return new Promise((resolve) => {
    const server = httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
  });
}