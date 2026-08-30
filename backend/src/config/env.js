import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').default('postgresql://musab_user:musab_password@localhost:5432/musabkanat_db?schema=public'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('musab-kanat-default-jwt-secret-key-development-mode-only'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  ADMIN_NAME: z.string().default('Musab Admin'),
  ADMIN_EMAIL: z.string().email().default('admin@musabkanat.com'),
  ADMIN_PHONE: z.string().default('+905552194353'),
  ADMIN_PASSWORD: z.string().default('MusabAdmin2026!')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Environment validation failed:', parsedEnv.error.format());
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});
