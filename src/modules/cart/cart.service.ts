import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BadRequestMessege, NotFoundMessege, PublicMessege } from 'src/common/enums/message.enum';

@Injectable({scope : Scope.REQUEST})
export class CartService {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity> ,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity> ,
    @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity> ,
    @InjectRepository(CartItemEntity) private cartItemRepository: Repository<CartItemEntity> ,
    @Inject(REQUEST) private request: Request
  ){}

  async addToCart(productId: number){
    const userId = this.request.user.id
    await this.checkExistingProduct(productId)
    let cart = await this.cartRepository.findOne({
      where : {
        userId
      }
    })

    if(!cart){
      cart = this.cartRepository.create({
        userId ,
      })
    }

    let cartItem = await this.cartItemRepository.findOne({
      where : {
        cartId : cart.id,
        productId
      }
    })

    if(cartItem){
      cartItem.quantity += 1;
    }
    else {
      cartItem = await this.cartItemRepository.create({
        productId ,
        cartId : cart.id ,
        quantity : 1
      })
    }
    await this.cartRepository.save(cart)
    await this.cartItemRepository.save(cartItem)

    return {
      message : PublicMessege.AddedToCart
    }
  }

  async removeOneItemFromCart(productId: number){
    const userId = this.request.user.id
    await this.checkExistingProduct(productId)
    const cart = await this.cartRepository.findOne({
      where : {
        userId
      }
    })

    let cartItem = await this.cartItemRepository.findOne({
      where : {
        cartId : cart.id,
        productId
      }
    })

    if(!cartItem) throw new BadRequestException(BadRequestMessege.NotInCart)

    cartItem.quantity -= 1;
    await this.cartItemRepository.save(cartItem)
    if(cartItem.quantity == 0){
      await this.cartItemRepository.delete({productId})
    }

    return {
      message : PublicMessege.DeletedFromCart
    }

  }

  async removeFromCart(productId: number){
    const userId = this.request.user.id
    await this.checkExistingProduct(productId)
    const cart = await this.cartRepository.findOne({
      where : {
        userId
      }
    })

    let cartItem = await this.cartItemRepository.findOne({
      where : {
        cartId : cart.id,
        productId
      }
    })

    if(!cartItem) throw new BadRequestException(BadRequestMessege.NotInCart)

    await this.cartItemRepository.delete({productId})

    return {
      message : PublicMessege.DeletedFromCart
    }

  }

  async checkExistingProduct(id: number) {
    const product = await this.productRepository.findOneBy({id})
    if(!product) throw new NotFoundException(NotFoundMessege.NotFoundProduct)
    return product
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
