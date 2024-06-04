import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { UserStatus } from "src/modules/user/enums/user-status.enum";
import { AuthMessege } from "src/common/enums/message.enum";
import { isJWT } from "class-validator";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService){}
    async canActivate(context: ExecutionContext) {
        const httpContext = context.switchToHttp()
        const request: Request = httpContext.getRequest<Request>()
        const token = this.extractToken(request)
        request.user = await this.authService.validateAccessToken(token);
        if(request?.user?.status === UserStatus.Block) throw new ForbiddenException(AuthMessege.Blocked)
        return true;
    }

    protected extractToken(request: Request){
        const {authorization} = request.headers;
        if(!authorization || authorization?.trim() == ""){
            throw new UnauthorizedException(AuthMessege.LogInRequired)
        }
        const [bearer , token] = authorization?.split(" ")
        if(bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)){
            throw new UnauthorizedException(AuthMessege.LogInRequired)
        }
        return token;
    }
    
}