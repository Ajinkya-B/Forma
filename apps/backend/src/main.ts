import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for mobile app
  app.enableCors({
    origin: '*', // In production, specify your mobile app's origin
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}/api`);
}
bootstrap();
