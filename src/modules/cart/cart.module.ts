import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports : [AuthModule , TypeOrmModule.forFeature([CartEntity , CartItemEntity , ProductEntity , UserEntity])] ,
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
