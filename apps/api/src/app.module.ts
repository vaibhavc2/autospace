import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { UsersModule } from './users/users.module';
import { configSchema } from './utils/env/config/config.schema';
import { EnvModule } from './utils/env/env.module';
import { EnvService } from './utils/env/env.service';
import { HealthModule } from './utils/health/health.module';
import { LoggerModule } from './utils/logger/logger.module';
import { PrismaModule } from './utils/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      validate: (env) => configSchema.parse(env),
    }),
    JwtModule.registerAsync({
      imports: [EnvModule], // Make EnvModule available
      inject: [EnvService], // Inject EnvService to use it for configuration
      useFactory: async (configService: EnvService) => {
        // Extract JWT_SECRET and JWT_MAX_AGE from the environment config
        const { JWT_SECRET, JWT_MAX_AGE } = configService.envConfig;
        // Return the JWT configuration object
        return {
          global: true,
          secret: JWT_SECRET,
          signOptions: { expiresIn: JWT_MAX_AGE },
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      fieldResolverEnhancers: ['guards'],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //TODO: implement as AuthGuard, etc. for production
        limit: 100,
      },
    ]),
    EnvModule,
    PrismaModule,
    HealthModule,
    LoggerModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // logger middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
