import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ExtendedConfigService } from './config/extended-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(Logger);

  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      // transforms if @Type() decorator is specified in dtos
      // Automatically transforms with @Params() decorator, i.e. @Params(':id') id -> number
      // To sum up, transformation of primitive types only works with parameters
      transform: true,
      validationError: {
        value: true // exposes validated value
      }
      // exceptionFactory: (errors) => new ValidationException(errors)
    })
  );

  app.enableShutdownHooks();

  // startup
  const configService = app.get<ExtendedConfigService>(ExtendedConfigService);

  const port = configService.get('server.port');
  const baseUrl = configService.get('server.serverBaseUrl');

  await app.listen(port);

  logger.log(
    `Server is instantiated and listening to incoming requests - ${baseUrl}`
  );
  logger.log(`Service health check - ${baseUrl}/health`);
}

bootstrap();
