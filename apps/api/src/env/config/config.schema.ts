import { z } from 'zod';

export const configSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  NODE_ENV: z.string().default('development'),
});

export type EnvConfig = z.infer<typeof configSchema>;
