import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false  // Indica que si hago un findOneBy  nunca va a retornar este dato. Por lo tanto usamos findOne en el login.
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    // Este genera la columana userId en la tabla product
    @OneToMany(
        () => Product, // Aca va a entidad a la que hace referncia la union, osea la tabla products.
        ( product ) => product.user // esta seria la columna de esa entidad, user
    )
    product: Product;


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim(); // Capitalizo a minuscula el email.
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}