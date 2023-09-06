import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import redisClient from './db/redis.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.APP_PORT || 3000;

  // Swagger Docs
  const options = new DocumentBuilder()
    .setTitle('BACKEND API')
    .setDescription('This is Backend API bulit using NestJS framework & Typescript.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'Header',
      },
      'bearer',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger/api', app, document);

  await app.listen(PORT, () => {
    redisClient.on('connect', () => {
      console.log('Redis DB connected');
    });
  });
}
bootstrap();
