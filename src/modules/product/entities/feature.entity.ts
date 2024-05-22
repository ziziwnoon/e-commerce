import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, Entity } from "typeorm";

@Entity("feature")
export class FeatureEntity extends BaseEntity{
    @Column({nullable : true})
    length: number
    @Column({nullable : true})
    height: number
    @Column({nullable : true})
    width: number
    @Column({nullable : true})
    weight: number
    @Column('simple-array' , {nullable : true})
    color: string[]
    @Column('simple-array' , {nullable:  true})
    model: string[]
    @Column({nullable : true})
    madein: string
}