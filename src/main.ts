import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {



  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
}));


const config = new DocumentBuilder()
.setTitle('Beam Application ')
.setDescription('API documentation for Bean Application')
.setVersion('1.0')
.setVersion('1.0')
.addBearerAuth()
.setBasePath('api')
.build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document,{
swaggerOptions: {
  persistAuthorization: true,
  tryItOutEnabled: true,
  displayRequestDuration: true,
  filter: true,
},
} ); 
  app.enableCors({
    origin:["http://localhost:5173"],
    credentials: true, 
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
  });


  
  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
