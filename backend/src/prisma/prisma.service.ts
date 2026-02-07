import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const databaseUrl = config.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const pool = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({ adapter: pool });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected to Postgres');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
