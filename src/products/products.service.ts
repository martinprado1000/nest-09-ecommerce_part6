import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Product, ProductImage } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService'); // Genera un logger para este servicio.
  private defaultLimit: number;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,  // DataSource: Sabe la cadena de conexion que estamos usando, es como un repositorio. Lo usamos para crear el queryRunner.
                                              // queryRunner: Lo vamos a usar en el update. Lo que hace es ejecutar mas de una consulta, si alguna sale mal hace un rollback.
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('pagination.defaultLimit');
  }

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      // const product = this.productRepository.create(createProductDto);   // Creamos el registro
      // Como ahora vamos a guardar el producto en la db producto y las imagenes en la otra db lo tenemos que guardar de la siguiente manera:

      const { images = [], ...productDetails } = createProductDto; // Destructura el objeto de la siguiente manera: Si las imagenes no viene le asigna un array vacio. Operador Rest: ...productDetails: esto lo que hace es que todos los demas datos queden en productDetails.

      //console.log(user)
      const product = this.productRepository.create({
        ...productDetails,      // Operador Spread: estraigo los datos
        user,                   // Le pasamos el user logueado para generar el userId de creacion del producto.
        images: images.map((image) => this.productImageRepository.create({ url: image }),  // OJO el orden, el create tiene que estar al final.
        ),
      });
      
      // TypeORM infiere que como estoy creando imagenes dentro de la creacion de un producto, ese id es que le va a asignar a cada una de las imagenes para hace la relación.
      // Luego salva todo de una sola vez porque las imagenes se encuentran dentro del producto.
      await this.productRepository.save(product); // Guarda en la db
      return { ...product, images }; // Retorno asi para que no retornar el id de las imagenes.
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = this.defaultLimit, offset = 0 } = paginationDto;
      const product = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true, // Obtengo los datos relacionado
        },
      });
      return product.map((product) => ({
        // Retorno asi para sacarle el id de la db de las imagenes, como hice con el create.
        ...product,
        images: product.images.map((img) => img.url),
      }));
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      //product = await this.productRepository.findOneBy({ slug:term }); // Lo podria hacer asi pero de la siguiente manera evitamos la inyeccion SQL.
      // Lo que hace de acontinuacion es buscar un solo producto por  titulo o slug discriminando miniscula y mayuscula
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); // Trae mucha info de mi db. Esto lo hacemos para evitar inyeccion SQL y le asigno un alias, prod en este caso.
      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          slug: term.toLowerCase(),
          title: term.toUpperCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages') // Este trae la relacion. En este caso no lo hace automatico porque no estoy usando un metodo find sino un queryBuilder, Asique se trae de esa forma. Y el 'prodImages' es porque hay que asignarle un alias a esa relacion.
        .getOne();
    }
    if (!product)
      throw new NotFoundException(`Product witch id ${term} not found`);
    return product;
  }

  async findOnePlane(term: string) {  // Este metodo lo usamos para retornar el producto con las imagenes sin el id de imagen.
    const { images = [], ...rest } = await this.findOne(term);
    const productPlane = {
      ...rest,
      images: images.map( image => image.url ), 
    };
    return productPlane
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    // En el update si viene una o mas imagenes vamos a borrar todas y guardar las nuevas.

    const { images, ...restToUpdate } = updateProductDto
    const product = await this.productRepository.preload({ id, ...restToUpdate });  // preload: Actualiza. En este punto solo actualizo los datos.

    if (!product)
      throw new NotFoundException(`Product witch id ${id} not found`);

    // Ejecutamos la consulta con queryRunner. Lo que hace es ejecutar mas de una consulta, si alguna sale mal hace un rollback.
    const queryRunner = this.dataSource.createQueryRunner(); // Crea el queryRunner.
    await queryRunner.connect()           // Inicia la conexion
    await queryRunner.startTransaction()  // le indicamos que arranca la transaccion queryRunner, si algo sale mal hace el callback hasta este punto.

    try {
      if( images ) { // Si hay imagenes primero borro todas las que hay.
        await queryRunner.manager.delete( ProductImage, { product: {id} }) // Referenciamos a la table que queremos borrar (ProductImage). Y luego el criterio que seria la columna de la tabla producto conicida con el productId ques sea igual al id que me mandaron, seria la columna productId pero como typeOrm lo hizo automatico y para el es el id, seria como hacer:  { product: {id:productId} }
      
        product.images = images.map(
          image => this.productImageRepository.create({url:image}) // Guardo las imagener
        )
      }
    
      product.user = user;  // Le pasamos el user logueado para generar el userId cuando actualice el producto.
      await queryRunner.manager.save(product);  // Aca indica que termina la operacion queryRunner
      await queryRunner.commitTransaction();    // Aca aplica la transaccion
      await queryRunner.release()               // Aca Limpia el cueryRynner

      return this.findOnePlane(id)  // Como lo primero que hice en el update fue 
      
      
      //return await this.productRepository.save(product);
    } catch (error) {
      await queryRunner.rollbackTransaction() // Aca hacemos el rollBack si algo de la eliminacion salio mal.
      this.handleExceptions(error);
    }
    
  }

  async remove(id: string) {
    //const product = await this.productRepository.delete(id)  // No uso el delete porque en el caso siguiente si primero lo busco y no encuentra registro lanza la exepcion de mi metodo y finaliza.
    const product = await this.findOne(id); // Llamamos a nuestro metodo findOne, si no existe ahi mismo ya lanza la exepcion y sale de la ajecucion.
    await this.productRepository.remove(product); // Si llega a este punto es poque pudo eliminar y no es necesario retornar nada.
  }

  async removeAllProducts () {  // Metodo para eliminar todos los productos.
    const query = this.productRepository.createQueryBuilder('prod')
    try {
      return await query
        .delete()
        .where({})
        .execute(); 
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  private handleExceptions(error: any) {
    // Metodo para retornar error de productService
    if (error.code === '23505') throw new BadRequestException(error.detail); // 23505: Error dato duplicado
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
