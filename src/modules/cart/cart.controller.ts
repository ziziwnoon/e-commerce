import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('cart')
@ApiTags('Cart')
@AuthDecorator()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("/add/:productId")
  @ApiConsumes(SwaggerConsumes.Urlencoded , SwaggerConsumes.Json)
  addToCart(@Param('id') productId: string) {
    return this.cartService.addToCart(+productId);
  }

  @Delete("/remove-one/:productId")
  @ApiConsumes(SwaggerConsumes.Urlencoded , SwaggerConsumes.Json)
  removeOneFromCart(@Param('id') productId: string) {
    return this.cartService.removeOneItemFromCart(+productId);
  }
  
  @Delete("/remove/:productId")
  @ApiConsumes(SwaggerConsumes.Urlencoded , SwaggerConsumes.Json)
  removeFromCart(@Param('id') productId: string) {
    return this.cartService.removeFromCart(+productId);
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
