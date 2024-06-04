import { BadRequestException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponse } from './type/auth-response.type';
import { AuthType } from './enum/type.enum';
import { AuthMethod } from './enum/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { AuthMessege, BadRequestMessege, PublicMessege, ValidationMessege } from 'src/common/enums/message.enum';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './token.service';
import { CookieTokenOption } from 'src/common/utils/cookie.util';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Request, Response } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({scope: Scope.REQUEST})
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity> ,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity> ,
        private tokenService: TokenService ,
        @Inject(REQUEST) private request: Request
    ){}
    async userDataEntry(authDto: AuthDto , res: Response){
        const {method , type , username} = authDto
        let result: AuthResponse

        switch (type) {
            case AuthType.Register:
                result =  await this.register(method , username)
                return this.sendResponse(res, result)          
            case AuthType.Login:
                result =  await this.login(method , username)
                return this.sendResponse(res, result)
            default:
                break;
        }
    }

    async register(method: AuthMethod , username: string){
        const validUsername = this.usernameValidator(method , username)
        let user : UserEntity = await this.checkExistingUser(method , validUsername)
        if(user) throw new UnauthorizedException(AuthMessege.UserExistedAlready)
        if(method === AuthMethod.Username) throw new UnauthorizedException(BadRequestMessege.InvalidLoginData)
        user = this.userRepository.create({
            [method] : username
        })
        user = await this.userRepository.save(user)
        user.username = `m_${user.id}`
        await this.userRepository.save(user)
        const otp = await this.saveOtp(user.id , method)
        //token
        const token = this.tokenService.generateCookieToken({userId : user.id})
        return {
            code : otp.code ,
            token
        }
    }


    async login(method: AuthMethod , username: string){
        const validUsername = this.usernameValidator(method , username)
        let user : UserEntity = await this.checkExistingUser(method , validUsername)
        if(!user) throw new UnauthorizedException(AuthMessege.NotFoundAccount)
        const otp = await this.saveOtp(user.id , method)
        const token = this.tokenService.generateCookieToken({userId : user.id})
        return {
        code : otp.code ,
        token
    }
    }

    usernameValidator(method: AuthMethod , username: string){
        switch (method) {
            case AuthMethod.Email:
                if(isEmail(username)) return username;
                throw new BadRequestException(ValidationMessege.InvalidEmailFormat)
            case AuthMethod.Phone:
                if(isMobilePhone(username , "fa-IR")) return username;
                throw new BadRequestException(ValidationMessege.InvalidPhoneFormat)
            case AuthMethod.Username:
                if(username) return username;
                throw new BadRequestException(BadRequestMessege.InvalidDataFormat)
            default:
                throw new UnauthorizedException()
        }
    }


    async checkExistingUser(method: AuthMethod , username: string){
        let user: UserEntity

        if(method === AuthMethod.Email){
            user = await this.userRepository.findOneBy({email : username})
        }
        else if(method === AuthMethod.Phone){
            user = await this.userRepository.findOneBy({phone : username})
        }
        else if(method === AuthMethod.Username){
            user = await this.userRepository.findOneBy({username})
        }
        else { 
            throw new BadRequestException(BadRequestMessege.InvalidLoginData)
        }
        return user
    }

    async saveOtp(userId: number , method: AuthMethod){
        const code = randomInt(10000 , 99999).toString();
        const expiresIn = new Date(Date.now() + (1000 * 60 * 2))
        let existingOtp = false
        let otp = await this.otpRepository.findOneBy({userId})

        if(otp){
            existingOtp = true
            otp.code = code
            otp.expiresIn = expiresIn
            otp.method = method
        } else {
            otp = this.otpRepository.create({code , method , expiresIn , userId })
        }

        otp = await this.otpRepository.save(otp)

        if(!existingOtp){
            await this.userRepository.update({id: userId} , {otpId : otp.id})
        }

        return otp
    }


    async sendResponse(res: Response, result: AuthResponse){
        const {token , code} = result
        res.cookie(CookieKeys.OTP , token , CookieTokenOption() )
        res.json({
          message: PublicMessege.SentOtp ,
          code
        })
    }

    async checkOtp(code: string){
        const token = this.request?.cookies[CookieKeys.OTP]
        if(!token) throw new UnauthorizedException(AuthMessege.ExpiredOtp)
        const {userId} = this.tokenService.verifyToken(token)
        const otp = await this.otpRepository.findOneBy({userId})
        if(!otp) throw new UnauthorizedException(AuthMessege.LogInAgain)
        const now = new Date()
        if(otp.expiresIn < now) throw new UnauthorizedException(AuthMessege.ExpiredOtp)
        if(otp.code !== code) throw new UnauthorizedException(AuthMessege.TryAgain)    
        const accessToken = this.tokenService.generateAccessToken({userId})
        if(otp.method === AuthMethod.Email){
            await this.userRepository.update({id:userId} , {verify_email : true})
        }
        else if(otp.method === AuthMethod.Phone){
            await this.userRepository.update({id:userId} , {verify_phone : true})
        }
        return {
            message : PublicMessege.LoggedIn ,
            accessToken
        }
        
    }
    

    async validateAccessToken(token: string){
        const {userId} = this.tokenService.verifyAccessToken(token);
        const user = await this.userRepository.findOneBy({id : userId})
        if(!user) throw new UnauthorizedException(AuthMessege.LogInAgain)
        return user;
      }
}
