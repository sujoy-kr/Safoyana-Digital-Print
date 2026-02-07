import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const saltRound = Number(this.config.get<string>('SALT_ROUNDS')) || 10;

    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(dto.password, salt);

    try {
      await this.prismaService.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          hash,
        },
      });

      return {
        success: true,
        message: 'User registered successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.hash);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ token: string }> {
    const payload: JwtPayload = {
      id: userId,
      email,
    };

    const secret = this.config.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
      const token = await this.jwt.signAsync(payload, {
        secret,
      });
      return { token };
    } catch {
      throw new InternalServerErrorException('Failed to generate token');
    }
  }
}
