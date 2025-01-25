//import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger'; // Cambiamos la importacion PartialType para que funcione con swagger
import { CreateProductDto } from './create-product.dto';

// Swager, cambiamos la importacion de PartialType y con eso ya detecta los valores de donde extiende.
// Mestra lo mismo que en el CreateProductDto pero SIN el * porque es opcional 
export class UpdateProductDto extends PartialType(CreateProductDto) {}
