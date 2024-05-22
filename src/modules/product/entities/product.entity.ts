import { BaseEntity } from "src/common/abstracts/base.entity"
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm"
import { FeatureEntity } from "./feature.entity"
import { CategoryEntity } from "src/modules/category/entities/category.entity"
import { UserEntity } from "src/modules/user/entities/user.entity"
import { EntityName } from "src/common/enums/entity.enum"

@Entity(EntityName.Product)
export class ProductEntity extends BaseEntity {
    @Column()
    title: string
    @Column()
    short_text : string
    @Column()
    text: string
    // @Column({type : "binary"})
    // images: string
    @Column("simple-array")
    tags: string[]
    @Column()
    categoryId: number
    @Column()
    price: number
    @Column()
    discount: number
    @Column()
    count: number
    @Column()
    supplierId: number
    @ManyToOne(() => UserEntity , supplier => supplier.products)
    supplier: UserEntity
    @OneToOne(() => FeatureEntity )
    @JoinColumn()
    feature: FeatureEntity[]
    @ManyToMany(() => CategoryEntity)
    @JoinTable()
    categories: CategoryEntity[]

    // @Column()
    // comments: string
    // @Column()
    // likes: string
    // dislikes
    // bookmark
}
