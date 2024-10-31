import { startServer, closeConnections } from '../server.ts';

let server;

beforeAll(async () => {
  await closeConnections();
  server = await startServer();
});

afterAll(async () => {
  if (server) {
    await server.close();
    await closeConnections();
  }
}); 