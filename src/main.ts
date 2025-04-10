import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // CORS configuration should come before other middleware
  app.enableCors({
    origin: ["http://localhost:5173", "https://credpal-backend-assesment-app.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Access-Control-Allow-Credentials"
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  const config = new DocumentBuilder()
    .setTitle('Beam Application ')
    .setDescription('API documentation for Bean Application')
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      filter: true,
    },
  });

  await app.listen(process.env.PORT ?? 9000);
}

bootstrap();
