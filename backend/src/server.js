import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDB, disconnectDB } from './config/db.js';

let server;

async function startServer() {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(`🚀 Musab Kanat Backend API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`Health check: http://localhost:${env.PORT}/api/health`);
    logger.info(`Menu API: http://localhost:${env.PORT}/api/menu`);
  });
}

// Graceful Shutdown
async function handleShutdown(signal) {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      logger.info('Graceful shutdown completed.');
      process.exit(0);
    });

    // Force close after 10s if hanging
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    await disconnectDB();
    process.exit(0);
  }
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason }, 'Unhandled Rejection at Promise');
});

process.on('uncaughtException', (err) => {
  logger.error({ err: err.message, stack: err.stack }, 'Uncaught Exception thrown');
  process.exit(1);
});

startServer();
