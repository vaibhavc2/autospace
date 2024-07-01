import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { EnvService } from './utils/env/env.service';
import { logger } from './utils/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  // environment variables
  const configService = app.get(EnvService);
  const port = configService.get('PORT');
  const devEnv = configService.get('NODE_ENV') === 'development';

  // middlewares
  app.enableCors(); //TODO: setup CORS gracefully in production
  app.use(cookieParser());
  app.enableVersioning({
    // this is for REST API versioning
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });
  app.use(
    helmet(
      devEnv
        ? {
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: {
              directives: {
                imgSrc: [
                  `'self'`,
                  'data:',
                  'apollo-server-landing-page.cdn.apollographql.com',
                ],
                scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
                manifestSrc: [
                  `'self'`,
                  'apollo-server-landing-page.cdn.apollographql.com',
                ],
                frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
              },
            },
          }
        : {},
    ),
  );

  // start the app
  await app.listen(port);

  // log the server address in development
  if (devEnv) {
    const address = await app.getHttpServer().address().address;
    const url = `http://${address === '::' ? 'localhost' : address}:${port}`;

    logger.log(`=> Application is running on: ${url}`);
    logger.log(`=> GraphQL Playground is running on: ${url}/graphql`);
  }
}
bootstrap();
