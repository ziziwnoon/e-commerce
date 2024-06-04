import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function ProductFilter(){
    return applyDecorators(
        ApiQuery({name : "category" , example:"nestjs" , required: false }) ,
        ApiQuery({name : "search" , example:"product title , short_text , text" , required: false }) ,
    )
}