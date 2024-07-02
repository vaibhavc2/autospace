import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvConfig } from './config/config.schema';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvConfig, true>) {}

  private get<T extends keyof EnvConfig>(key: T) {
    return this.configService.get(key, { infer: true });
  }

  get envConfig(): EnvConfig {
    return {
      PORT: this.configService.get('PORT'),
      NODE_ENV: this.configService.get('NODE_ENV'),
      DATABASE_URL: this.configService.get('DATABASE_URL'),
      JWT_SECRET: this.configService.get('JWT_SECRET'),
      JWT_MAX_AGE: this.configService.get('JWT_MAX_AGE'),
    };
  }

  get isDev(): boolean {
    return this.envConfig.NODE_ENV === 'development';
  }

  get isProd(): boolean {
    return this.envConfig.NODE_ENV === 'production';
  }
}
