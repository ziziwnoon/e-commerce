import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { EntityName } from "src/common/enums/entity.enum";

@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntity{
    @Column({nullable : true})
    nick_name: string
    @Column({nullable : true})
    password: string
    @Column({nullable: true})
    bio: string
    @Column({nullable: true})
    gender: string
    @Column({nullable: true})
    profile_image: string
    @Column({nullable: true})
    bg_image: string
    @Column({nullable: true})
    birthday: Date
    @Column({nullable: true})
    userId: number
    @OneToOne(() => UserEntity , user => user.profile , {onDelete: "CASCADE"})
    user: UserEntity
}