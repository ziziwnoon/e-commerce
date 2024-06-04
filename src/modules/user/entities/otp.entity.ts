import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityName.Otp)
export class OtpEntity extends BaseEntity{
    @Column()
    code: string
    @Column()
    expiresIn: Date
    @Column({nullable : true})
    method: string
    @Column()
    userId: number
    @OneToOne(() => UserEntity , user => user.otp , {onDelete: "CASCADE"})
    user: UserEntity
    @CreateDateColumn()
    created_at: Date
    @UpdateDateColumn()
    updated_at: Date
}