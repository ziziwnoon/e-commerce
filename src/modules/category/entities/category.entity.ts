import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity{
    @Column()
    title: string;
    @Column()
    description: string;
    @Column({ nullable: true })
    slug?: string;
    @Column({ nullable: true })
    parentId: number;
    @ManyToOne(() => CategoryEntity , category => category.sub_categories , {onDelete : "SET NULL"})
    parent: CategoryEntity
    @OneToMany(() => CategoryEntity , sub_category => sub_category.parent , { onDelete : "SET NULL"})
    @JoinColumn({name : "parent"})
    sub_categories: CategoryEntity[]
    @ManyToMany(() => ProductEntity)
    products: ProductEntity[]
    // @TreeParent()
    // parent: CategoryEntity
    // @TreeChildren()
    // children: CategoryEntity[]
}
