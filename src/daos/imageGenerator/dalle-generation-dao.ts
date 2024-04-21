import { singleton } from 'tsyringe';
import { ImageGenerationDao } from './image-generation-dao-interface';
import { openai } from '../../middlewares/open-ai';
import { createTransparentMaskFromUrl, imageUrlToBuffer, imageUrlToReadStream } from '../utils/image-utils';

@singleton()
export class DalleGenerationDao implements ImageGenerationDao {
  public generateImage = async (imageUrl: string, prompt: string): Promise<Buffer> => {
    // Adjustments may be needed if your API or middleware supports handling an image URL directly.
    // Assuming you have a way to handle images by URL or previously generated image tokens:
    const response = await openai.images.edit({
      model: 'dall-e-2',
      image: await imageUrlToReadStream(imageUrl),
      mask: await createTransparentMaskFromUrl(imageUrl),
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    console.log('Image generated:', response.data[0].url);
    // Assuming the API returns the image data as a base64 encoded string within `response.data.image`
    if (!response.data[0].url) {
      throw Error('Error while processing image');
    }
    const imageData = imageUrlToBuffer(response.data[0].url);
    return imageData;
  };
}
