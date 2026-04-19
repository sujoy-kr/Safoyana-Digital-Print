import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockPrisma = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a product', async () => {
      const dto: any = { name: 'Poster', basePrice: 10, slug: 'poster', attributes: {} };
      const createdProduct = { id: 'uuid-1', ...dto };
      
      mockPrisma.product.create.mockResolvedValue(createdProduct);

      const result = await service.create(dto);
      expect(prisma.product.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(createdProduct);
    });

    it('should throw BadRequestException if category does not exist (P2003)', async () => {
      const dto: any = { name: 'Poster', basePrice: 10, categoryId: 'invalid-id' };
      const error = new Prisma.PrismaClientKnownRequestError('Foreign key failed', {
        code: 'P2003',
        clientVersion: '4',
      } as any);

      mockPrisma.product.create.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all products with categories', async () => {
      const products = [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }];
      mockPrisma.product.findMany.mockResolvedValue(products);

      const result = await service.findAll();
      expect(prisma.product.findMany).toHaveBeenCalledWith({ include: { category: true } });
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a single product by ID', async () => {
      const product = { id: '1', name: 'Product 1' };
      mockPrisma.product.findUnique.mockResolvedValue(product);

      const result = await service.findOne('1');
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: '1' }, include: { category: true } });
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const dto: any = { name: 'Updated Poster' };
      const updated = { id: '1', ...dto };
      mockPrisma.product.update.mockResolvedValue(updated);

      const result = await service.update('1', dto);
      expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if product to update does not exist (P2025)', async () => {
      const dto: any = { name: 'Updated Poster' };
      const error = new Prisma.PrismaClientKnownRequestError('Record to update not found', {
        code: 'P2025',
        clientVersion: '4',
      } as any);

      mockPrisma.product.update.mockRejectedValue(error);

      await expect(service.update('99', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      mockPrisma.product.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });

    it('should throw NotFoundException if product to delete does not exist (P2025)', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Record to delete not found', {
        code: 'P2025',
        clientVersion: '4',
      } as any);

      mockPrisma.product.delete.mockRejectedValue(error);

      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});
