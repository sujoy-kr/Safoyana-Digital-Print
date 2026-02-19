import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Module({
  imports: [JwtModule, ConfigModule],
  controllers: [CategoryController],
  providers: [CategoryService, JwtAuthGuard, AdminGuard],
})
export class CategoryModule { }
