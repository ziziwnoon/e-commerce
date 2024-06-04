import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessPayloadType, CookiePayloadType } from "./type/payload.type";
import { AuthMessege } from "src/common/enums/message.enum";

@Injectable()
export class TokenService{
    constructor(private jwtService: JwtService){}

    generateCookieToken(payload: CookiePayloadType){
        const token = this.jwtService.sign(payload , {
            secret : process.env.OTP_TOKEN_SECRET ,
            expiresIn : 60 * 2
        })
        return token;
    }

    verifyToken(token: string) : CookiePayloadType {
        try {
            return this.jwtService.verify(token , {
                secret : process.env.OTP_TOKEN_SECRET
            })
        } catch (error) {
            throw new UnauthorizedException(AuthMessege.TryAgain)
        }
    }

    generateAccessToken(payload: AccessPayloadType){
        const token = this.jwtService.sign(payload , {
            secret : process.env.ACCESS_TOKEN_SECRET ,
            expiresIn : "1y"
        })
        return token;
    }

    verifyAccessToken(token: string) : AccessPayloadType {
        try {      
            return this.jwtService.verify(token , {
                secret : process.env.ACCESS_TOKEN_SECRET
            })
            
        } catch (error) {
            throw new UnauthorizedException(AuthMessege.TryAgain)
        }
    }
}