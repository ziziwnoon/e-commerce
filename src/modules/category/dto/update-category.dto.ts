import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCategoryDto {
    @ApiPropertyOptional()
    title: string;
    @ApiPropertyOptional()
    description: string
}
