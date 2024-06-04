import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateProductDto, ProductFilterDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { isArray } from 'class-validator';
import { BadRequestMessege, NotFoundMessege, PublicMessege } from 'src/common/enums/message.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../image/entities/image.entity';
import { Any, DataSource, In, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import e, { Request } from 'express';
import { CategoryEntity } from '../category/entities/category.entity';
import { ProductEntity } from './entities/product.entity';
import { CategoryService } from '../category/category.service';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationGenerator, PaginationResolver } from 'src/common/utils/pagination.util';
import { EntityName } from 'src/common/enums/entity.enum';
import { Role } from 'src/common/enums/role.enum';
import { createSlug, randomId } from 'src/common/utils/functions';

@Injectable({scope : Scope.REQUEST})
export class ProductService {
  constructor(@InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity> ,
              @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity> ,
              @InjectRepository(ProductCategoryEntity) private productCategoryRepository: Repository<ProductCategoryEntity> ,
              @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity> ,
              private categoryService: CategoryService ,
              @Inject(REQUEST) private request: Request  ,
              private dataSource: DataSource
              ){}
  async create(createProductDto: CreateProductDto) {
    const userId = this.request.user.id
    let {title , 
      short_text ,
      slug ,
      text , 
      images , 
      count , 
      categoryIds ,
      color ,
      discount, 
      price , 
      height ,
      length , 
      madein , 
      model , 
      weight , 
      width
     } = createProductDto

    let slugData = slug ?? title
    slug = createSlug(slugData)
    const existingSlug = await this.checkExistingProductBySlug(slug)
    if(existingSlug) {
        slug += `-${randomId()}`
    }
    if(!width) width = 0;
    else width = +width;
    if(!weight) weight = 0;
    else weight = +weight;
    if(!height) height = 0;
    else height = +height;
    if(!length) length = 0;
    else length = +length;
    if(!discount) discount = 0;
    else discount = +discount;
    
    if(!isArray(images) && typeof images === "string"){
      images = images.split(",")
    } else if(!isArray(images)) {
        throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
    }
    if(color){
      if(!isArray(color) && typeof color === "string"){
        color = color.split(",")
      } else if(!isArray(color)) {
          throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
      }
    } else color = []
    if(model){
      if (!isArray(model) && typeof model === "string"){
        model = model.split(",")
      } else if(!isArray(model)) {
          throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
      }
    } else model = []
    if(!isArray(categoryIds) && typeof categoryIds === "string"){
      categoryIds = categoryIds.split(",")
    } else if(!isArray(categoryIds)) {
        throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
    }

    let product = this.productRepository.create({
        title , slug , short_text , text , count , price ,
        discount ,
        color , 
        height , 
        width , 
        weight , 
        images ,
        madein ,
        model , 
        length 
      })

    const categoryIdsCount = await this.categoryRepository.count({
      select: ['id'],
      where: { id: In(categoryIds) }
    });
    if (categoryIdsCount !== categoryIds.length) throw new NotFoundException(NotFoundMessege.NotFoundCategory)

    await this.productRepository.save(product)
      
    for (const categoryId of categoryIds) {
      await this.productCategoryRepository.insert({
        productId: product.id ,
        categoryId : +categoryId
      }) 
    }
    
    return {
      message: PublicMessege.Created
    }
   
}


async checkExistingProductBySlug(slug: string){
  const product = await this.productRepository.findOneBy({slug})
  return product
}

async findAll(paginationDto: PaginationDto , productFilterDto: ProductFilterDto) {
  const {limit , page , skip} = PaginationResolver(paginationDto)
      let {category , search} = productFilterDto

      let where = ''

      if(category){
          category = category.toLocaleLowerCase()
          if(where.length > 0) where += ' AND '
          where += 'category.title = LOWER(:category)'
      }
      if(search){
          if(where.length > 0) where += " AND "
          search = `%${search}%`
          where += 'CONCAT(product.title , product.short_text , product.text) ILIKE :search'
      }

      const [products , count] = await this.productRepository.createQueryBuilder(EntityName.Product)
      .leftJoin("product.categories" , "categories")
      .leftJoin("categories.category" , "category")
      .leftJoin("product.supplier" , "supplier")
      .leftJoin("supplier.profile" , "profile")
      .addSelect(["categories.id" , "category.title" , "supplier.id" , "supplier.username" , "profile.nick_name"])
      .where(where , {category , search})
      // .loadRelationCountAndMap("blog.likes" , "blog.likes")
      // .loadRelationCountAndMap("blog.bookmarks" , "blog.bookmarks")
      // .loadRelationCountAndMap("blog.comments" , "blog.comments" , "comments" , (qb) => 
      //     qb.where("comments.accepted= :accepted" , {accepted : true})
      //  )
      .orderBy("product.id" , "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount()

      return {
          pagination: PaginationGenerator(count , page , limit) ,
          products
      }
}

  async myProducts(){
    const {id} = this.request.user
    return await this.productRepository.find({
        where : {
            supplierId : id
        } ,
        order : {
            id : "DESC"
        }
    })
}

async findProductById(id: number){
  const product = await this.productRepository.findOneBy({id})
  if(!product) throw new NotFoundException(NotFoundMessege.NotFoundProduct)
  return product
}

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const {id: supplierId} = this.request.user
    const product = await this.findProductById(id)
    let {title , 
      short_text ,
      text , 
      images , 
      count , 
      categoryIds ,
      color ,
      discount, 
      price , 
      height ,
      length , 
      madein , 
      model , 
      weight , 
      width
     } = updateProductDto

    if(!isArray(categoryIds) && typeof categoryIds === "string"){
      categoryIds = categoryIds.split(",")
    } else if(!isArray(categoryIds)) {
        throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
    }
    if(!isArray(color) && typeof color === "string"){
      color = color.split(",")
    } else if(!isArray(color)) {
        throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
    }
    if(!isArray(images) && typeof images === "string"){
      images = images.split(",")
    } else if(!isArray(images)) {
        throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
    }
   
    if (!isArray(model) && typeof model === "string"){
      model = model.split(",")
    } else if(!isArray(model)) {
        throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
    }

     if(title) product.title = title
     if(short_text) product.short_text = short_text
     if(text) product.text = text
     if(images) product.images = images
     if(count) product.count = count
     if(discount) product.discount = discount
     if(price) product.price = price
     if(height) product.height = height
     if(length) product.length = length
     if(madein) product.madein = madein
     if(weight) product.weight = weight
     if(width) product.width = width
     if(color) product.color = color
     if(model) product.model = model
     if(images) product.images = images

    if(categoryIds && isArray(categoryIds) && categoryIds.length > 0){
      await this.productCategoryRepository.delete({productId : product.id})
    }

    const categoryIdsCount = await this.categoryRepository.count({
      select: ['id'],
      where: { id: In(categoryIds) }
    });
    if (categoryIdsCount !== categoryIds.length) throw new NotFoundException(NotFoundMessege.NotFoundCategory)
    for (const categoryId of categoryIds) {
      await this.productCategoryRepository.insert({
        productId: product.id ,
        categoryId : +categoryId
      }) 
    }
  

  }

  async remove(id: number) {
    await this.findProductById(id)
    await this.productRepository.delete({id})
    return {
        message : PublicMessege.Deleted
    }
  }


  async findOneBySlug(slug: string , paginationDto: PaginationDto){
    const userId = this.request?.user?.id

    const product = await this.productRepository.createQueryBuilder(EntityName.Product)
    .leftJoin("product.categories" , "categories")
    .leftJoin("categories.category" , "category")
    .leftJoin("product.supplier" , "supplier")
    .leftJoin("supplier.profile" , "profile")
    .addSelect(["categories.id" , "category.title" , "supplier.id" , "supplier.username" , "profile.nick_name"])
    .where({slug})
    // .loadRelationCountAndMap("blog.likes" , "blog.likes")
    // .loadRelationCountAndMap("blog.bookmarks" , "blog.bookmarks")
    .getOne()
    if(!product) throw new NotFoundException(NotFoundMessege.NotFoundProduct)

    // const comments = await this.blogCommentService.findCommentsOfBlog(blog.id , paginationDto)
    // let isLiked = false
    // let isBookmarked = false

    // if(userId && !isNaN(userId) && userId>0){
    //     isLiked = !!(await this.blogLikeRepository.findOneBy({userId , blogId : blog.id}))
    //     isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({userId , blogId : blog.id}))
    // }

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    
    const suggestedProducts = await queryRunner.query(`
        WITH suggested_products AS (
            SELECT 
                product.id ,
                product.title ,
                product.slug ,
                product.short_text ,
                product.text ,
                product.image ,
                json_build_object(
                    'username', u.username,
                    'author_name', p.nick_name,
                    'image', p.profile_image
                ) AS supplier ,
                array_agg(DISTINCT cat.title) AS categories,
            FROM product
            LEFT JOIN public.user u ON product."supplierId" = u.id
            LEFT JOIN profile p ON p."userId" = u.id
            LEFT JOIN product_category bc ON product.id = bc."productId"
            LEFT JOIN category cat ON bc."categoryId" = cat.id
            GROUP BY product.id , u.username , p.nick_name , p.profile_image
            ORDER BY RANDOM()
            LIMIT 3
        )
        SELECT * FROM suggested_products
    `)

    return {
        product ,
        suggestedProducts
    }

    // (
    //   SELECT COUNT(*) FROM blog_like
    //   WHERE blog_like."blogId" = blog.id
    // ) AS likes ,
    // (
    //     SELECT COUNT(*) FROM blog_bookmark
    //     WHERE blog_bookmark."blogId" = blog.id
    // ) AS bookmarks ,
    // (
    //     SELECT COUNT(*) FROM blog_comment
    //     WHERE blog_comment."blogId" = blog.id
    // ) AS comments 
  }
}
