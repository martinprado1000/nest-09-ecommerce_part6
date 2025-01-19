import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '.';

@Entity()
export class ProductImage {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  url: string;

  @ManyToOne(() => Product, (product) => product.images)  // @ManyToOne: relación muchos a uno, creo solo la columna productId.
  product: Product;
}
