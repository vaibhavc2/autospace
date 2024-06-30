import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });
  app.use(cookieParser());
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  //   prefix: 'v',
  // });

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  await app.listen(port, 'localhost');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
