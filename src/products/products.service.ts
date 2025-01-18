import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService'); // Genera un logger para este servicio.
  private defaultLimit:number;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('pagination.defaultLimit')
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto); // Creamos el registro
      await this.productRepository.save(product); // Guarda en la db
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = this.defaultLimit, offset = 0} = paginationDto
      const product = await this.productRepository.find({
        take: limit,
        skip: offset,
      });
      return product;
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
      const queryBuilder = this.productRepository.createQueryBuilder(); // Trae mucha info de mi db. Esto lo hacemos para evitar inyeccion SQL.
      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          slug: term.toLowerCase(),
          title: term.toUpperCase(),
        })
        .getOne();
    }
    if (!product)
      throw new NotFoundException(`Product witch id ${term} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product)
      throw new NotFoundException(`Product witch id ${id} not found`);

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //const product = await this.productRepository.delete(id)  // No uso el delete porque en el caso siguiente si primero lo busco y no encuentra registro lanza la exepcion de mi metodo y finaliza.
    const product = await this.findOne(id); // Llamamos a nuestro metodo findOne, si no existe ahi mismo ya lanza la exepcion y sale de la ajecucion.
    await this.productRepository.remove(product); // Si llega a este punto es poque pudo eliminar y no es necesario retornar nada.
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
