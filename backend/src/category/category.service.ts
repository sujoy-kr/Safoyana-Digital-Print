import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prismaService.category.create({
      data: createCategoryDto as unknown as Prisma.CategoryCreateInput,
    });
  }

  async findAll() {
    return await this.prismaService.category.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prismaService.category.update({
      where: {
        id,
      },
      data: updateCategoryDto as unknown as Prisma.CategoryUpdateInput,
    });
  }

  async remove(id: string) {
    return await this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
