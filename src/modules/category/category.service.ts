import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager,  IsNull,  Repository } from 'typeorm';
import { createSlug, randomId } from 'src/common/utils/functions';
import { BadRequestMessege, NotFoundMessege, PublicMessege } from 'src/common/enums/message.enum';
import { EntityName } from 'src/common/enums/entity.enum';

@Injectable({scope: Scope.REQUEST})
export class CategoryService {
  constructor(@Inject(REQUEST) private request: Request ,
              @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
              private dataSource: DataSource ,
              private readonly entityManager: EntityManager,
){}

  async create(createCategoryDto: CreateCategoryDto) {
    let {parentId , description , slug ,title} = createCategoryDto 
    let parentCat = null
    const existingTitle = await this.categoryRepository.findOneBy({title})
    if(existingTitle) throw new BadRequestException(BadRequestMessege.AlreadyExistingTitle)
    if(parentId && !isNaN(parentId)){
      parentCat = await this.categoryRepository.findOneBy({id: +parentId})
    }
    let slugData = slug ?? title
    slug = createSlug(slugData)
    const existingSlug = await this.checkExistingCategoryBySlug(slug)
    if(existingSlug) {
        slug += `-${randomId()}`
    }
    await this.categoryRepository.insert({
      description , 
      slug  ,
      title , 
      parentId : parentCat ? parentId : null
    })

    return {
      message : PublicMessege.Created
    }
  }

  async findAll() {
    //  let sub_categories = true
    //  return this.categoryRepository.find({
    //    where : {} ,
    //    relations:[...(sub_categories ? ['sub_categories'] : [])]
    //  })


    return this.categoryRepository.find({
      where : {parentId : IsNull()} ,
      relations : {
        sub_categories : { 
          sub_categories : true
      }
      }
    })
  }

  findOne(id: number) {
    return this.categoryRepository.find({
      where : {id} ,
      relations : {
        sub_categories : { 
          sub_categories : true
        }
      }
    })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const {title , description } = updateCategoryDto
    const category = await this.categoryRepository.findOneBy({id})
    if(!category) throw new NotFoundException(NotFoundMessege.NotFoundCategory)
    if(title) category.title = title
    if(description) category.description = description

    await this.categoryRepository.save(category)

    return {
      message : PublicMessege.Updated
    }
  }

  async remove(id: number) {
    await this.checkExistingCategoryById(id)
    await this.categoryRepository.delete({id})

    return {
      message: PublicMessege.Deleted
    }
  }

  async checkExistingCategoryBySlug(slug: string){
    const category = await this.categoryRepository.findOneBy({slug})
    return category
  }
  async checkExistingCategoryById(id: number){
    const category = await this.categoryRepository.findOneBy({id})
    if(!category) throw new NotFoundException(NotFoundMessege.NotFoundCategory)
    return category
  }
}
