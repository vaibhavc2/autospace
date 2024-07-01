import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvService } from './utils/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableCors(); //TODO: setup CORS gracefully in production
  app.use(cookieParser());
  app.enableVersioning({
    // this is for REST API versioning
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  const configService = app.get(EnvService);
  const port = configService.get('PORT');
  const devEnv = configService.get('NODE_ENV') === 'development';

  await app.listen(port);

  if (devEnv) {
    const address = await app.getHttpServer().address().address;
    const url = `http://${address === '::' ? 'localhost' : address}:${port}`;

    console.log(`Application is running on: ${url}`);
    console.log(`GraphQL Playground is running on: ${url}/graphql`);
  }
}
bootstrap();
