import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from 'src/upload/upload.service';


@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly uploadService: UploadService,
  ) { }


  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (image) {
      const res = await this.uploadService.upload(image);
      const baseUrl = process.env.API_URL || 'http://localhost:3000';
      createCategoryDto.image = res.url.startsWith('/') ? `${baseUrl}${res.url}` : res.url;
    }
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (image) {
      const res = await this.uploadService.upload(image);
      const baseUrl = process.env.API_URL || 'http://localhost:3000';
      updateCategoryDto.image = res.url.startsWith('/') ? `${baseUrl}${res.url}` : res.url;
    }
    return await this.categoryService.update(id, updateCategoryDto);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
