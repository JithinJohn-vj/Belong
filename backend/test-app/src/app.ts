import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { config } from './config';

const buildApp = async () => {
  const app = Fastify({
    logger: {
      level: config.logLevel,
    },
  });

  // Register plugins
  await app.register(cors, { origin: true });
  await app.register(helmet);

  // TODO: Register database plugin (see plugins/db.ts)
  // TODO: Register auth middleware (see middleware/auth.ts)
  // TODO: Register route plugins (see routes/)

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
};

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`Server running on http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { buildApp };
