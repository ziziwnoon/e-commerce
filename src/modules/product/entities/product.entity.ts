import { BaseEntity } from "src/common/abstracts/base.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm"
import { CategoryEntity } from "src/modules/category/entities/category.entity"
import { UserEntity } from "src/modules/user/entities/user.entity"
import { EntityName } from "src/common/enums/entity.enum"
import { ProductCategoryEntity } from "./product-category.entity"

@Entity(EntityName.Product)
export class ProductEntity extends BaseEntity {
    @Column()
    title: string
    @Column({nullable : true})
    slug: string
    @Column()
    short_text : string
    @Column()
    text: string
    @Column('simple-array')
    images: string | string[]
    @Column()
    price: number
    @Column({default : 0})
    discount: number
    @Column()
    count: number
    @Column({nullable : true , default : 0})
    length: number
    @Column({nullable : true , default : 0})
    height: number
    @Column({nullable : true , default : 0})
    width: number
    @Column({nullable : true ,  default : 0})
    weight: number
    @Column('simple-array' , {nullable : true , default : []})
    color: string[]
    @Column('simple-array' , {nullable:  true})
    model: string[]
    @Column({nullable : true , default : null})
    madein: string
    @Column()
    supplierId: number
    @ManyToOne(() => UserEntity , supplier => supplier.products)
    supplier: UserEntity
    @OneToMany(() => ProductCategoryEntity , category => category.product)
    categories: ProductCategoryEntity[]
    @CreateDateColumn()
    created_at: Date
    @UpdateDateColumn()
    updated_at: Date
    // @Column()
    // comments: string
    // @Column()
    // likes: string
    // dislikes
    // bookmark
}
