import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ProfileEntity } from '../user/entities/profile.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity , OtpEntity , ProfileEntity])] ,
  controllers: [AuthController],
  providers: [AuthService , TokenService , JwtService],
  exports: [AuthService , TokenService , JwtService ,TypeOrmModule],
})
export class AuthModule {}
