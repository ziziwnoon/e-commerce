import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true ,
    envFilePath : join(process.cwd() , ".env")
  }),
  TypeOrmModule.forRoot(TypeOrmConfig()),
  UserModule,
  AuthModule,
  CategoryModule,
  ProductModule,
  ImageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
