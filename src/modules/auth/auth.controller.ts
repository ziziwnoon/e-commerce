import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { Response } from 'express';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("user-data-entry")
  @ApiConsumes(SwaggerConsumes.Urlencoded , SwaggerConsumes.Json)
  userEntry(@Body() authDto: AuthDto , @Res()  res: Response){
    return this.authService.userDataEntry(authDto , res)
  }

  @Post("check-otp")
  @ApiConsumes(SwaggerConsumes.Urlencoded , SwaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto: CheckOtpDto){
    return this.authService.checkOtp(checkOtpDto.code)
    
  }
}
