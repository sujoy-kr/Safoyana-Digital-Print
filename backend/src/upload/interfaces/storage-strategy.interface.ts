export interface IStorageStrategy {
  uploadFile(file: Express.Multer.File): Promise<{ url: string; originalname: string }>;
}
