import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
import type { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prismaService.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A category with this slug already exists.',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.prismaService.category.findMany();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.prismaService.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Cannot update: Category not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A category with this slug already exists.',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.category.delete({
        where: { id },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Cannot delete: Category not found`);
      }
      throw error;
    }
  }
}
