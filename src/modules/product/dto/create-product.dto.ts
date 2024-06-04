import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsObject, Length, ValidateNested } from "class-validator"

export class CreateProductDto{
    @ApiProperty()
    @Length(3 , 150)
    @IsNotEmpty()
    title: string
    @ApiProperty()
    @Length(10 , 300)
    @IsNotEmpty()
    short_text: string
    @ApiProperty()
    @Length(100)
    @IsNotEmpty()
    text: string
    @ApiProperty({type : "string" , isArray: true})
    @IsNotEmpty()
    images: string[] | string
    @ApiProperty({type : "string" , isArray: true})
    categoryIds: string[] | string
    @ApiProperty()
    @IsNotEmpty()
    price: number
    @ApiPropertyOptional({default : 0})
    discount: number
    @ApiProperty()
    @IsNotEmpty()
    count: number
    @ApiPropertyOptional()
    length: number
    @ApiPropertyOptional()
    height: number
    @ApiPropertyOptional()
    width: number
    @ApiPropertyOptional()
    weight: number
    @ApiPropertyOptional({type : "string" , isArray: true})
    color: string[] | string
    @ApiPropertyOptional({type : "string" , isArray: true})
    model: string[] | string 
    @ApiPropertyOptional()
    madein:  string
}



export class ProductFilterDto{
    category: string;
    search: string;
}