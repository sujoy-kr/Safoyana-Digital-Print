import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Module({
  imports: [AuthModule, JwtModule, ConfigModule],
  controllers: [ProductController],
  providers: [ProductService, JwtAuthGuard, AdminGuard],
})
export class ProductModule { }
