import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
// npm i -D @types/multer: instalar tipo de dato de multer


@Controller('files')
export class FilesController { 
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(         // Este metodo retorna la imagen.
    @Res() res: Response,   // Cuando aplico la respuesta de express, si o si tengo que responder con res de Express para responder. Si no retorna nada.
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProducImage( imageName )
    res.sendFile(path)      // Respondo con express porque aplique el decorador @Res
  }


  // npm i -D @types/multer: instalar tipo de dato de multer
  @Post('product')
  @UseInterceptors(FileInterceptor    // QUseInterceptors: es para interceptar datos, y lo usamos para indicar que vamos a usarlo con FileInterceptor, y este recive 3 parametros:
    ('file', {                        // 1- El nombre de la propiedad del body con la que mandan el archivo.
    fileFilter: fileFilter,           // 2- La funcion que creamos con la cual vamos a interceptar lo enviado. Esta es mi funcion que fintra el archivo. Eso solo indica si permite o no el archivo.
     // 3- Configuraciones
    limits: {                        
      fileSize: 5 * 1024 * 1024  //5Mb
    },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer             // renombro el archivo con mi funcion. Asignamdole una nueba propiedad filename
    }) 
                 
  })) 
  uploadProductImage(                 // NOMBRE DEL METODO
    @UploadedFile() file: Express.Multer.File) { // @UploadedFile(): decorador que nos permite recibir archivos,  Express.Multer.File: tipamos el dato
    
      // En este punto ya paso por el filtro y vino rechazado o no.
      if ( !file ){
        throw new BadRequestException('The image must be an image')
      }
    
      const secureUrl = `${this.configService.get<string>('hostApi')}/files/product/${file.filename}` // Generamos una url amigable con el nombre del archivo.
    
    return { secureUrl };
  }
}
