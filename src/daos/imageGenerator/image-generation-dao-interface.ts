export interface ImageGenerationDao {
  generateImage(imageUrl: string, prompt: string): Promise<Buffer>;
}

