import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductFilterDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { ProductFilter } from 'src/common/decorators/product.folter.decorator';

@Controller('product')
@ApiTags("Product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.Json , SwaggerConsumes.Urlencoded)
  @ApiBearerAuth("Authorization") 
  @UseGuards(AuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get("/by-slug/:slug")
  findProductBySlug(@Param('slug') slug: string){
    return this.productService.findOneBySlug(slug)
  }


  @Get("/")
  @Pagination()
  @ProductFilter()
  findAll(@Query() paginationDto: PaginationDto , @Query() productFilterDto: ProductFilterDto) {
    return this.productService.findAll(paginationDto , productFilterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes(SwaggerConsumes.Json , SwaggerConsumes.Urlencoded)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
