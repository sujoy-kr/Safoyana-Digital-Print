import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== new Set(productIds).size) {
      throw new BadRequestException('One or more products not found');
    }

    let totalAmount = 0;
    const itemsData = createOrderDto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const unitPrice = Number(product.basePrice);
      totalAmount += unitPrice * item.quantity;

      const customConfigInput = item.customConfig
        ? (item.customConfig as Prisma.InputJsonValue)
        : Prisma.JsonNull;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        customConfig: customConfigInput,
      };
    });

    return this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findAll(userId: number, role: string) {
    const where = role === 'ADMIN' ? {} : { userId };
    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: number, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role !== 'ADMIN' && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only PENDING orders can be modified');
    }

    // Since replacing items is complex, we just allow cancelling or simple updates if needed.
    // In a real-world scenario, you might delete old items and recreate new ones based on the DTO.
    if (updateOrderDto.items) {
      const productIds = updateOrderDto.items.map((i) => i.productId);
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== new Set(productIds).size) {
        throw new BadRequestException('One or more products not found');
      }

      let totalAmount = 0;
      const itemsData = updateOrderDto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        const unitPrice = Number(product.basePrice);
        totalAmount += unitPrice * item.quantity;

        const customConfigInput = item.customConfig
          ? (item.customConfig as Prisma.InputJsonValue)
          : Prisma.JsonNull;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          customConfig: customConfigInput,
        };
      });

      // Transaction: delete old items and create new ones
      return this.prisma.$transaction(async (prisma) => {
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        return prisma.order.update({
          where: { id },
          data: {
            totalAmount,
            items: {
              create: itemsData,
            },
          },
          include: { items: true },
        });
      });
    }

    return order;
  }

  async cancel(id: string, userId: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only PENDING orders can be cancelled');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted successfully' };
  }
}
