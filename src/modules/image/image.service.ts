import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { MulterFile } from 'src/common/utils/multer.util';
import { Request } from 'express';
import { NotFoundMessege, PublicMessege } from 'src/common/enums/message.enum';

@Injectable({scope : Scope.REQUEST})
export class ImageService {
  constructor(@InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity> ,
              @Inject(REQUEST) private request: Request   
             ){}
  async create(createImageDto: ImageDto , image: MulterFile) {
    const userId = this.request.user.id
    const {name , alt} = createImageDto
    let location = image?.path?.slice(7).replace(/\\/g , "/")
    await this.imageRepository.insert({
      alt : alt || name ,
      name ,
      location ,
      userId
    })

    return {
      message: PublicMessege.Created
    }
  }

  findAll() {
    const userId = this.request.user.id
    return this.imageRepository.find({
      where: {userId} ,
      order: {id: "DESC"}
    })
  }

  findOne(id: number) {
    const userId = this.request.user.id
    const image = this.imageRepository.findOne({
      where: {userId , id} ,
      order: {id: "DESC"}
    })
    if(!image) throw new NotFoundException(NotFoundMessege.NotFound)  
    return image
  }


  async remove(id: number) {
    const image = await this.findOne(id)
    await this.imageRepository.remove(image)
    return {
      message: PublicMessege.Deleted
    }
  }
}
