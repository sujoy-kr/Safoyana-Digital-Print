import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Business Cards' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'business-cards' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'https://my-bucket.s3.amazonaws.com/category-business-cards.jpg',
    description: 'The main display image URL for the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
