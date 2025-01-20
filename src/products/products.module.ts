import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Product,ProductImage]) 
  ],
  exports: [
    ProductsService,
    TypeOrmModule   // Generalmente tambien se exporta el TypeOrmModule  del modulo para usar en otro lado.
  ]
})
export class ProductsModule {}
