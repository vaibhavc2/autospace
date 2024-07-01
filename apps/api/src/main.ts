import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import {
  helmetDevelopmentConfig,
  restApiVersioningConfig,
} from './constants/bootstrap.constants';
import { envConstants } from './constants/env.constants';
import { swaggerConfig } from './docs/swagger.config';
import { logger } from './utils/logger/winston.logger';

const { port, isDev } = envConstants;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  // middlewares
  app.enableCors(); //TODO: setup CORS gracefully in production
  app.use(cookieParser());
  app.enableVersioning(restApiVersioningConfig);
  app.use(helmet(isDev ? helmetDevelopmentConfig : {}));
  app.setGlobalPrefix('api');

  // setup the swagger docs
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);

  // start the app
  await app.listen(port);

  // log the server address in development
  if (isDev) {
    const address = await app.getHttpServer().address().address;
    const url = `http://${address === '::' ? 'localhost' : address}:${port}`;

    logger.log(`=> API is running on: '${url}'`);
    logger.log(`=> Apollo Sandbox for GraphQL is running on: '${url}/graphql'`);
  }
}
bootstrap();
