import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap') 

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

  // Swagger
  // En la version nueva los tags se cargan automaticamente.
  const config = new DocumentBuilder()
    .setTitle('Ecommerce RESTFul API')
    .setDescription('Ecommerce endpoints')
    .setVersion('1.0')
    //.addTag('Default') // Esto lo hace automatico en la nueva version, agrega el tag correspondiente al endpoint.
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);  
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT);
  logger.log(`App runing on port ${process.env.PORT}`)
}
bootstrap();
