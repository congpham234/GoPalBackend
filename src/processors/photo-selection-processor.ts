import { inject, singleton } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { OpenAiFacade } from '../externalservice/ai/open-ai-facade';

@singleton()
export class PhotoSelectionService {
  constructor(@inject(OpenAiFacade) private openAiFacade: OpenAiFacade) {}

  public generateUniqueId(): string {
    return uuidv4();
  }

  public async getBestPhotoIds(
    allPhotoLists: {
      description: string;
      photos: { photoTag: string; photoId: string }[];
    }[],
  ): Promise<string[]> {
    const systemPrompt = `
      You are a photo selection assistant. Your goal is to find the most relevant photo from each provided list based on the description.
      Each photo has a tag and a unique ID. 
      For each list, evaluate the photos based on how well their tags match the description.
      Return the ID of the best matching photo for each list.
      If no photo matches the description well, return an empty string for that list.
      Your response should be a JSON array where each element corresponds to the best photo ID for each list.
      Example: [{"photoId": "123e4567-e89b-12d3-a456-426614174000"}, {"photoId": ""}, {"photoId": "987e6543-e21b-43d3-b765-765432176543"}]
    `;
    const userPrompt = `Here are the photo lists: ${JSON.stringify(allPhotoLists)}. Evaluate the photos based on how well their tags match the following descriptions.`;
    const answer = await this.openAiFacade.answer(systemPrompt, userPrompt);

    try {
      const response = JSON.parse(answer);
      if (
        !Array.isArray(response) ||
        response.some((item) => typeof item.photoId !== 'string')
      ) {
        throw new Error('The response is not a valid structure');
      }
      return response.map((item) => item.photoId);
    } catch (error) {
      console.error('Error parsing the best photo result:', error);
      throw new Error('Failed to parse the best photo result');
    }
  }
}
