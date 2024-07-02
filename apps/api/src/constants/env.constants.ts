import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/utils/env/config/config.schema';
import { EnvService } from 'src/utils/env/env.service';

// new instance of the EnvService with the ConfigService
const configService = new EnvService(new ConfigService());

const envConfig: EnvConfig = {
  PORT: configService.get('PORT'),
  NODE_ENV: configService.get('NODE_ENV'),
  DATABASE_URL: configService.get('DATABASE_URL'),
  JWT_SECRET: configService.get('JWT_SECRET'),
  JWT_MAX_AGE: configService.get('JWT_MAX_AGE'),
};

// extra constants
const nodeEnv = envConfig.NODE_ENV;
const isDev = nodeEnv === 'development';
const isProd = nodeEnv === 'production';

export const envConstants = {
  isDev,
  isProd,
  ...envConfig,
};
