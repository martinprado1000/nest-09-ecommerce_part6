import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '../auth/entities/user.entity'; 
import { ValidRoles } from 'src/auth/interfaces';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';

//Swagger: @ApiTags('Products') Asi agregaria los tags de swagger, ya lo hace automatico
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  //Swagger: @ApiResponse: respuestas posible
  @ApiResponse({ status:200, description: 'Product was created', type: Product}) // Type es lo que retorna
  @ApiResponse({ status:400, description: 'Pad request'})
  @ApiResponse({ status:403, description: 'Forbidden, token related'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto,) {
    const { limit = 10, offset = 0} = paginationDto
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term') // term:  temino de busqueda, lo hago asi porque no solo vamos a buscar por el id
  findOne(@Param('term') term: string) {  // En vez de usar findOne uso el metodo findOnePlane que retorna el metodo plano.
    return this.productsService.findOnePlane(term);
  }

  @Patch(':id') 
  @Auth()
  update( 
    @Param('id',ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
