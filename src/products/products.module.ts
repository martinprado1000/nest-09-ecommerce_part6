import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product,ProductImage]), 
    ConfigModule,
    AuthModule
  ],
  exports: [
    ProductsService,
    TypeOrmModule   // Generalmente tambien se exporta el TypeOrmModule  del modulo para usar en otro lado.
  ]
})
export class ProductsModule {}
