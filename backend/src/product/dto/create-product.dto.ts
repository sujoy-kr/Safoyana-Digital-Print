import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Premium Business Cards' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'premium-business-cards' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'High quality offset printing...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10.0 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({
    example: [
      'https://my-bucket.s3.amazonaws.com/product-front.jpg',
      'https://my-bucket.s3.amazonaws.com/product-back.jpg',
    ],
    description: 'Array of image URLs for the product gallery',
  })
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty({ example: 'uuid-of-category' })
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'The flexible JSON definition for product options',
    required: false,
    example: { paper: 'matte', sizes: ['A4', 'A5'] },
  })
  @IsOptional()
  attributes?: any;
}
