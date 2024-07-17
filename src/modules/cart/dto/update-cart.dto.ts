import { PartialType } from '@nestjs/swagger';
import { AddToCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(AddToCartDto) {}
