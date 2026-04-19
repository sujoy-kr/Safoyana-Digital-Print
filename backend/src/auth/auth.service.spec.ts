import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn(),
  };

  const mockConfig = {
    get: jest.fn((key: string) => {
      if (key === 'SALT_ROUNDS') return '10';
      if (key === 'JWT_SECRET') return 'supersecret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    config = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      const dto = { name: 'Test', email: 'test@test.com', password: 'password123' };
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      
      mockPrisma.user.create.mockResolvedValue({ id: 1, email: dto.email, name: dto.name, role: 'USER' });
      mockJwt.signAsync.mockResolvedValue('mocked-token');

      const result = await service.register(dto);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 'salt');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: dto.email, name: dto.name, hash: 'hashedPassword' },
      });
      expect(result).toEqual({ access_token: 'mocked-token', role: 'USER' });
    });

    it('should throw ForbiddenException if email already exists', async () => {
      const dto = { name: 'Test', email: 'test@test.com', password: 'password123' };
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const error = new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '4.0.0',
      } as any);

      mockPrisma.user.create.mockRejectedValue(error);

      await expect(service.register(dto)).rejects.toThrow(ForbiddenException);
      await expect(service.register(dto)).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should successfully log in and return a token', async () => {
      const dto = { email: 'test@test.com', password: 'password123' };
      const user = { id: 1, email: dto.email, hash: 'hashedPassword', role: 'USER' };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwt.signAsync.mockResolvedValue('mocked-token');

      const result = await service.login(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.hash);
      expect(result).toEqual({ access_token: 'mocked-token', role: 'USER' });
    });

    it('should throw ForbiddenException on invalid email', async () => {
      const dto = { email: 'wrong@test.com', password: 'password123' };
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException on invalid password', async () => {
      const dto = { email: 'test@test.com', password: 'wrongpassword' };
      const user = { id: 1, email: dto.email, hash: 'hashedPassword', role: 'USER' };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(ForbiddenException);
    });
  });
});
