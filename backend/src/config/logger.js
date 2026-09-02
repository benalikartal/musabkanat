import pino from 'pino';
import { env } from './env.js';

const isDev = (env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development') && !process.env.VERCEL;

export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'passwordHash',
      'token',
      'secret',
      'DATABASE_URL',
      '*.password',
      '*.passwordHash',
      'body.password'
    ],
    censor: '[REDACTED]'
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined
});
