import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty()
    title: string
    @ApiProperty()
    description: string;
    @ApiPropertyOptional()
    slug: string;
    @ApiPropertyOptional()
    parentId: number
}
