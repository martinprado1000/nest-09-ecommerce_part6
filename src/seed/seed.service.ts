import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService:ProductsService 
  ) {}

  async executeSeed() {
    await this.insertNewProduct()
    return 'Seed executed';
  }

  private async insertNewProduct(){
    await this.productService.removeAllProducts()

    const seedProducts = initialData.products

    const insertPromises = [];

    seedProducts.forEach((product)=>{
      insertPromises.push( this.productService.create(product) )
    })
    const result = await Promise.all(insertPromises)  // Promise es nativo de JS6

    return true;
  }



}
