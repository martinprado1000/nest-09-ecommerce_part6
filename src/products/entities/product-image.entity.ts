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

  @ManyToOne(  // Relacion, esta seria nuestra columna que crea por defaulto con el nombre productId con la culuman id de product
    () => Product,
    (product) => product.images, // @ManyToOne: relación muchos a uno, crea automaticamente la columna productId.
    { onDelete: 'CASCADE' },      // OnDelete: cuando el producto se elimina en cascada 
  )
  product: Product;

}
