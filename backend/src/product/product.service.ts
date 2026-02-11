import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import type { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.prismaService.product.create({
        data: createProductDto as unknown as Prisma.ProductCreateInput,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(`Category does not exist.`);
      }
      throw error;
    }
  }

  async findAll(): Promise<ProductWithCategory[]> {
    return await this.prismaService.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<ProductWithCategory> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.prismaService.product.update({
        where: { id },
        data: updateProductDto as unknown as Prisma.ProductUpdateInput,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Cannot update: Product with ID '${id}' not found`,
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(`Category ID does not exist.`);
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.product.delete({
        where: { id },
      });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Cannot delete: Product with ID '${id}' not found`,
        );
      }
      throw error;
    }
  }
}
