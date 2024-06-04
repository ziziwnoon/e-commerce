import { BaseEntity } from "src/common/abstracts/base.entity"
import { EntityName } from "src/common/enums/entity.enum"
import { Column, Entity, ManyToOne } from "typeorm"
import { ProductEntity } from "./product.entity"
import { CategoryEntity } from "src/modules/category/entities/category.entity"

@Entity(EntityName.ProductCategory)
export class ProductCategoryEntity extends BaseEntity{
    @Column()
    productId: number
    @ManyToOne(() => ProductEntity , product => product.categories , {onDelete : "CASCADE"})
    product: ProductEntity
    @Column()
    categoryId: number
    @ManyToOne(() => CategoryEntity , category => category.product_categories , {onDelete : "CASCADE"})
    category: CategoryEntity
}