import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import redisClient from './db/redis.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.APP_PORT || 3000;

  await app.listen(PORT, () => {
    redisClient.on('connect', () => {
      console.log('Redis DB connected');
    });
  });
}
bootstrap();
