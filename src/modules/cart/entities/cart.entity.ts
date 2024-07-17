import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CartItemEntity } from "./cart-item.entity";
// import { CartItem, CartItemEntity } from "./cart-item.entity";

@Entity(EntityName.Cart)
export class CartEntity extends BaseEntity {
    @Column({nullable : true})
    total: number
    @ManyToOne(() => CartItemEntity, items => items.cart)
    items: CartItemEntity[]
    @Column()
    userId: number
    @OneToOne(() => UserEntity, user => user.cart)
    @JoinColumn()
    user: UserEntity
}
