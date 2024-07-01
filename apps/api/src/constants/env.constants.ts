import { ConfigService } from '@nestjs/config';
import { EnvService } from 'src/utils/env/env.service';

// new instance of the EnvService with the ConfigService
const configService = new EnvService(new ConfigService());

// constants
const port = configService.get('PORT');
const nodeEnv = configService.get('NODE_ENV');
const isDev = nodeEnv === 'development';
const isProd = nodeEnv === 'production';

export const envConstants = {
  port,
  nodeEnv,
  isDev,
  isProd,
};
