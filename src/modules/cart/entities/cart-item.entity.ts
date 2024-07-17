import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";

@Entity('order_products')
export class CartItemEntity extends BaseEntity {
  @Column()
  cartId: number
  @ManyToOne(() => CartEntity , cart => cart.items)
  cart: CartEntity;
  @Column()
  productId: number
  @ManyToOne(() => ProductEntity  , product => product.carts_item)
  product: ProductEntity
  @Column({default : 0})
  quantity: number;
}