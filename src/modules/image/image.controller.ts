import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto } from './dto/create-image.dto';
import { FileUpload } from 'src/common/interceptors/upload-file.interceptor';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { MulterFile } from 'src/common/utils/multer.util';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('image')
@ApiTags("Images")
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileUpload('image'))
  @ApiConsumes(SwaggerConsumes.Multipart)
  create(@Body() createImageDto: ImageDto , @UploadedFile() image: MulterFile) {
    return this.imageService.create(createImageDto , image);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
