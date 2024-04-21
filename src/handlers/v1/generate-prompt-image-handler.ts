import { inject, singleton } from 'tsyringe';
import { ImageStorageDao } from '../../daos/image-storage-dao';
import { ImageGenerationDao } from '../../daos/imageGenerator/image-generation-dao-interface';
import { DalleGenerationDao } from '../../daos/imageGenerator/dalle-generation-dao';

@singleton()
export class GeneratePromptImageHandler {
  private readonly imageStorageDao: ImageStorageDao;
  private readonly imageGenerationDao: ImageGenerationDao;

  constructor(
    @inject(ImageStorageDao) imageStorageDao: ImageStorageDao,
    @inject(DalleGenerationDao) imageGenerationDao: DalleGenerationDao,
  ) {
    this.imageStorageDao = imageStorageDao;
    this.imageGenerationDao = imageGenerationDao;
  }

  public async generatePromptImage(prompt: string): Promise<string | null> {
    console.log(prompt);

    const clientImageUrl = await this.imageStorageDao.getClientImageUrlFromS3('wine-bottle.png');
    const generatedImage = await this.imageGenerationDao.generateImage(clientImageUrl, 'change background to yellow');
    return await this.imageStorageDao.uploadImageAndGetUrlFromGeneratedImageBucket('prompImage', generatedImage);
  }
}
