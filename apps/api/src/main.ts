import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import {
  helmetDevelopmentConfig,
  versioningConfig,
} from './constants/bootstrap.constants';
import { swaggerConfig } from './docs/swagger.config';
import { EnvService } from './utils/env/env.service';
import { LoggerService } from './utils/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // disable the default logger
  });

  // environment variables
  const configService = app.get(EnvService);
  const { envConfig, isDev } = configService;
  const { PORT } = envConfig;

  // custom logger setup with winston
  const logger = app.get(LoggerService).getLogger();
  app.useLogger(logger);

  // middlewares
  app.enableCors(); //TODO: setup CORS gracefully in production
  app.setGlobalPrefix('api'); // set the global prefix for the REST API
  app.enableVersioning(versioningConfig); // enable versioning for the REST API
  app.use(cookieParser(), helmet(isDev ? helmetDevelopmentConfig : {}));

  // setup the swagger docs
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);

  // start the app
  await app.listen(PORT, 'localhost');

  // log the server address (will work only in development due to logger setup)
  if (isDev) {
    const url = await app.getUrl();
    logger.log(`=> API is running on: '${url}'`);
    logger.log(`=> Apollo Sandbox for GraphQL is running on: '${url}/graphql'`);
  }
}

bootstrap();
