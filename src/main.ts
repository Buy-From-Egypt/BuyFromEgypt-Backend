import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/all-exceptions.filter';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        if (errors.length > 0 && errors[0].constraints) {
          return {
            statusCode: 400,
            message: Object.values(errors[0].constraints)[0],
          };
        }
        return {
          statusCode: 400,
          message: 'Validation failed',
        };
      },
    })
  );

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));
  const config = new DocumentBuilder().setTitle('Buy From Egypt API').setDescription('API Documentation for Buy From Egypt').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('📄 Swagger Docs available at: http://localhost:3000/api-docs');
}

bootstrap();
