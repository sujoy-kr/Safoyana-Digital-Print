import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prismaService.product.create({
      data: createProductDto as unknown as Prisma.ProductCreateInput,
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.prismaService.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto as unknown as Prisma.ProductUncheckedUpdateInput,
    });
  }

  async remove(id: string): Promise<Product> {
    return await this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }
}
