import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ImageEntity } from '../image/entities/image.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { ProductCategoryEntity } from './entities/product-category.entity';

@Module({
  imports : [AuthModule , TypeOrmModule.forFeature([ProductEntity , ImageEntity , CategoryEntity , ProductCategoryEntity])] ,
  controllers: [ProductController],
  providers: [ProductService , CategoryService],
})
export class ProductModule {}
