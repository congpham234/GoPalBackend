import { inject, singleton } from 'tsyringe';
import { ImageStorageDao } from '../../daos/image-storage-dao';
import * as fs from 'fs';
import * as path from 'path';

@singleton()
export class GeneratePromptImageHandler {
  private readonly imageStorageDao: ImageStorageDao;

  constructor(@inject(ImageStorageDao) imageStorageDao: ImageStorageDao) {
    this.imageStorageDao = imageStorageDao;
  }

  public async generatePromptImage(prompt: string): Promise<string | null> {
    console.log(prompt);
    // UploadImageToS3
    const filePath = path.join(__dirname, '../../../tst/images', 'wine-bottle.png');
    const fileContent = fs.readFileSync(filePath);

    // const fileContent = Buffer.from(filePath ?? '', 'base64');
    return await this.imageStorageDao.uploadImageAndGetUrlFromGeneratedImageBucket('prompImage', fileContent);
  }
}
