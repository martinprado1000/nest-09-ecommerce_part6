import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envLoader } from './appConfig/envLoader.config';
import { envSchema } from './appConfig/envSchema.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({

  imports: [

    ConfigModule.forRoot({  // Obtiene variables de entorno y las valida segun le indiquemos. Por default las obtien de .env en la raiz
      load: [envLoader],            // Le indicamos de que archivo levantar las variables de entorno. Lo hago asi para poder estructurar mejor los datos.
      validationSchema: envSchema,  // Le indicamos cual es el archivo de validaciones de las variables de entorno (Los valores por defaul esta por escima de los valores por default que pudiera cargar en el envLoader)
      //isGlobal: true,               // Si dejo esta linea no haria falta importar el configModule en ningun modulo de ninguna entidad.  
    }),

    // npm install --save @nestjs/typeorm typeorm
    // npm install pg --save
    // IMPORTANTE: si no conecta la base de datos hay que crear la base manualmente
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_URI,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,      
      autoLoadEntities: true, // Carga automaticamente las entidades
      synchronize: true,      // Si hay un cambio en la base de datos toma esos cambio. No se suele dejar en producción.
    }),

    ServeStaticModule.forRoot({  // Indicamos la ruta de nuestras archivos publicos
      rootPath: join(__dirname,'..','public'), 
    }),

    ProductsModule,

    CommonModule,

  ],
})
export class AppModule {}

