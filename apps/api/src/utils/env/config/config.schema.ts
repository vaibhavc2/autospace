import { z } from 'zod';

export const configSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z
    .string()
    .optional()
    .default(
      'postgres://postgres:password@localhost:5432/autospace_db?schema=public',
    ),
  JWT_SECRET: z.string().min(32).default('jwt_secret'),
  JWT_MAX_AGE: z.string().default('1d'),
});

export type EnvConfig = Required<z.infer<typeof configSchema>>;
