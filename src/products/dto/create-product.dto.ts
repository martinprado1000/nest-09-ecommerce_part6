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

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

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

  @IsString({ each: true }) // each:true  indica que cada el elmento de ese arreglo tiene que ser un string
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

}
