import { Injectable, Inject } from '@nestjs/common';
import type { IStorageStrategy } from './interfaces/storage-strategy.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject('IStorageStrategy') private storageStrategy: IStorageStrategy,
  ) {}

  async upload(
    file: Express.Multer.File,
  ): Promise<{ url: string; originalname: string }> {
    return this.storageStrategy.uploadFile(file);
  }
}
