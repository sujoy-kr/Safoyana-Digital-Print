import {
  IsString,
  IsInt,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'product-uuid-123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: { paperSize: 'A4', color: 'CMYK', finish: 'Glossy' },
  })
  @IsOptional()
  customConfig?: any;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
