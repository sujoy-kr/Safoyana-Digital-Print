import { Injectable, BadRequestException } from '@nestjs/common';
import { IStorageStrategy } from '../interfaces/storage-strategy.interface';
import { extname, join } from 'path';
import * as fs from 'fs';

@Injectable()
export class LocalStorageStrategy implements IStorageStrategy {
  private readonly uploadDir = './uploads';

  constructor() {
    // Ensure the uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; originalname: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}${extname(file.originalname)}`;
    const filePath = join(this.uploadDir, filename);

    // Write the buffer to the file system
    await fs.promises.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/${filename}`,
      originalname: file.originalname,
    };
  }
}
