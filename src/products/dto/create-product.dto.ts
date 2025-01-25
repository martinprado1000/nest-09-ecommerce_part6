import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';
import { number, string } from 'joi';

export class CreateProductDto {

  @ApiProperty({
    description: 'Titulo del producto (unique)',
    type: string,
    nullable: false,
    minLength: 1  
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Precio del producto',
    type: number  
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @IsString()
  @MinLength(1)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsArray()
  @IsString({ each: true }) // each:true  indica que cada el elmento de ese arreglo tiene que ser un string
  sizes: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // each:true  indica que cada el elmento de ese arreglo tiene que ser un string
  images?: string[];

}
