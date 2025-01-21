import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  
  // Este metodo chequea si existe ese nombre de imagen para retornar el path completo
  getStaticProducImage( imageName: string) {
    const path = join( __dirname, '../../static/uploads', imageName);
    //console.log(path)
    if (!existsSync(path))
      throw new BadRequestException(`Not found product with name ${imageName}`);
    return path;
  }


}
