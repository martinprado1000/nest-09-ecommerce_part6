import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')  // A todas las rutas le agrega este prefijo antes
  
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,  // Esta linea lo que hace es que si me mandan datos de mas que no los reciba.
    forbidNonWhitelisted: true, // Retorna el error si nos envian datos de mas.
    transform:true,      //convertir automáticamente los datos recibidos (por ejemplo, de un req.body) al tipo definido en el DTO.
    transformOptions:{   //conversión implícita de tipos sin necesidad de usar el decorador @Type() de class-transformer.
      enableImplicitConversion: true,
    }
  }));  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
