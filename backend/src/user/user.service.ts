import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
         id: true,
         email: true,
         name: true,
         role: true,
         orders: true,
      }
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, data: any) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    
    // address is intentionally omitted because it's not present in the Prisma schema yet
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
          id: true,
          name: true,
          email: true,
          role: true,
      }
    });
  }
}
