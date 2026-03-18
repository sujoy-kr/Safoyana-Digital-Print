import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'IStorageStrategy',
      useClass: LocalStorageStrategy,
    },
  ],
})
export class UploadModule {}
