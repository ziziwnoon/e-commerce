import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString, Length } from "class-validator"
import { AuthType } from "../enum/type.enum"
import { AuthMethod } from "../enum/method.enum"

export class AuthDto{
    @ApiProperty()
    @IsString()
    @Length(3,100)
    username: string
    @ApiProperty({enum: AuthMethod})
    @IsEnum(AuthMethod)
    method: AuthMethod
    @ApiProperty({enum: AuthType})
    @IsEnum(AuthType)
    type: AuthType
}
export class CheckOtpDto{
    @ApiProperty()
    @IsString()
    @Length(5,5)
    code: string
}