import { singleton } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { OpenAiFacade } from '../externalservice/ai/open-ai-facade';

@singleton()
export class PhotoSelectionService {
  public generateUniqueId(): string {
    return uuidv4();
  }

  public async getBestPhotoIds(
    allPhotoLists: {
      description: string;
      photos: { photoTag: string; photoId: string }[];
    }[],
    openAiFacade: OpenAiFacade,
  ): Promise<string[]> {
    const systemPrompt = `
      You are given multiple lists of photos. Each photo has a tag and a unique ID. Your task is to determine the best photo in each list based on the provided description.
      For each list, return the ID of the best matching photo.
      If no photo matches the description well, return an empty string for that list.
      Your response should be a JSON array where each element corresponds to the best photo ID for each list.
      Example: [{"photoId": "123e4567-e89b-12d3-a456-426614174000"}, {"photoId": ""}, {"photoId": "987e6543-e21b-43d3-b765-765432176543"}]
    `;
    const userPrompt = `Here are the photo lists: ${JSON.stringify(allPhotoLists)}`;
    const answer = await openAiFacade.answer(systemPrompt, userPrompt);

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
