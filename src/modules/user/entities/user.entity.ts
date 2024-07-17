import { BaseEntity } from "src/common/abstracts/base.entity";
import { Role } from "src/common/enums/role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { OtpEntity } from "./otp.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { ImageEntity } from "src/modules/image/entities/image.entity";
import { CartEntity } from "src/modules/cart/entities/cart.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity{
        @Column({unique: true , nullable : true})
        username: string
        @Column({unique: true , nullable : true})
        email: string
        @Column({unique: true , nullable : true})
        new_email: string
        @Column({nullable: true , default : false})
        verify_email: boolean
        @Column({unique: true , nullable : true})
        phone: string
        @Column({unique: true , nullable : true})
        new_phone: string
        @Column({nullable: true , default : false})
        verify_phone: boolean
        @Column({nullable : true})
        password: string
        @Column({default : Role.User})
        role: string
        @Column({default : null})
        status: string
        @Column({nullable : true})
        @Column({nullable: true})
        profileId: number
        @OneToOne(() => ProfileEntity , profile => profile.user)
        @JoinColumn()
        profile: ProfileEntity
        @Column({nullable : true})
        otpId: number
        @OneToOne(() => OtpEntity , otp => otp.user)
        @JoinColumn()
        otp: OtpEntity
        @OneToMany(() => ProductEntity , products => products.supplier)
        products: ProductEntity[]
        @OneToOne(() => CartEntity, cart => cart.user)
        cart: CartEntity
        // otpId: number
        // @OneToOne(() => OtpEntity , otp => otp.user)
        // @JoinColumn()
        // otp: UserEntity
        // @Column({nullable : true})
        // profileId: number
        // @OneToOne(() => ProfileEntity , profile => profile.user)
        // @JoinColumn()
        // profile: ProfileEntity
        // @OneToMany(() => BlogEntity , blog => blog.author)
        // blogs: BlogEntity[]
        // @OneToMany(() => BlogBookmarkEntity , bookmark => bookmark.user)
        // blog_bookmarks: BlogBookmarkEntity[]
        // @OneToMany(() => BlogCommentEntity , comment => comment.user)
        // blog_comments: BlogCommentEntity[]
        @OneToMany(() => ImageEntity , image => image.user)
        images: ImageEntity[]
        @CreateDateColumn()
        created_at: Date
        @UpdateDateColumn()
        updated_at: Date    
}

