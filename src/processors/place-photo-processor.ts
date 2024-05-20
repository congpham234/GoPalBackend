import { inject, singleton } from 'tsyringe';
import { GooglePlacesFacade } from '../externalservice/tripplanning/google-places-facade';
import { PixabayFacade } from '../externalservice/photos/pixabay-facade';
import { Photo, SearchPhotosInput, SearchPhotosOutput } from './models/photos';
import { OpenAiFacade } from '../externalservice/ai/open-ai-facade';

@singleton()
export class PlacePhotoProcessor {
  constructor(
    @inject(GooglePlacesFacade) private googlePlacesFacade: GooglePlacesFacade,
    @inject(PixabayFacade) private pixabayFacade: PixabayFacade,
    @inject(OpenAiFacade) private openAiFacade: OpenAiFacade,
  ) {}

  public async searchPhotos(
    input: SearchPhotosInput,
  ): Promise<SearchPhotosOutput> {
    const allPhotoLists: {
      description: string;
      photos: { photoTag: string; photoIndex: number }[];
    }[] = [];
    const photoResults: Photo[] = [];
    const photoUriMap = new Map<number, string>();

    // Collect photo lists and store URIs in the map
    for (const query of input.queries) {
      const formattedQuery = query.replace(',', '');
      try {
        const result = await this.pixabayFacade.searchPhotos({
          name: formattedQuery,
          category: 'travel',
        });

        if (result.photos.length > 0) {
          const photosWithIndex = result.photos.map((photo, index) => {
            photoUriMap.set(index, photo.photoUri);
            return {
              photoTag: photo.tag,
              photoIndex: index,
            };
          });

          allPhotoLists.push({
            description: formattedQuery,
            photos: photosWithIndex,
          });
        } else {
          allPhotoLists.push({
            description: formattedQuery,
            photos: [],
          });
        }
      } catch (error) {
        console.error(`Error processing query "${query}":`, error);
        allPhotoLists.push({
          description: formattedQuery,
          photos: [],
        });
      }
    }

    // Determine the best photos using a single OpenAI call
    const bestPhotoIndices = await this.getBestPhotoIndices(allPhotoLists);

    // Process the results
    for (let i = 0; i < input.queries.length; i++) {
      const query = input.queries[i];
      const bestPhotoIndex = bestPhotoIndices[i];

      if (bestPhotoIndex !== -1 && allPhotoLists[i].photos.length > 0) {
        const bestPhotoUri = photoUriMap.get(bestPhotoIndex);
        if (bestPhotoUri) {
          photoResults.push({ photoUri: bestPhotoUri } as Photo);
        }
      } else {
        // Fallback to Google Photos if no best photo found
        try {
          const googlePhoto =
            await this.googlePlacesFacade.searchPlaceWithPhoto({
              textQuery: query,
            });
          photoResults.push({
            photoUri: googlePhoto.photoUri,
          });
        } catch (googleError) {
          console.error(
            `Error processing Google Photos fallback for query "${query}":`,
            googleError,
          );
        }
      }
    }

    return {
      photos: photoResults,
    };
  }

  private async getBestPhotoIndices(
    allPhotoLists: {
      description: string;
      photos: { photoTag: string; photoIndex: number }[];
    }[],
  ): Promise<number[]> {
    const systemPrompt = `
      You are given multiple lists of photos. Each photo has a tag and an index. Your task is to determine the best photo in each list based on the provided description.
      For each list, return the index of the best matching photo.
      If no photo matches the description well, return -1 for that list.
      Your response should be a JSON array where each element corresponds to the best photo index for each list.
      Example: [{"photoIndex": 2}, {"photoIndex": -1}, {"photoIndex": 0}]
    `;
    const userPrompt = `Here are the photo lists: ${JSON.stringify(allPhotoLists)}`;
    const answer = await this.openAiFacade.answer(systemPrompt, userPrompt);

    try {
      const response = JSON.parse(answer);
      if (
        !Array.isArray(response) ||
        response.some((item) => typeof item.photoIndex !== 'number')
      ) {
        throw new Error('The response is not a valid structure');
      }
      return response.map((item) => item.photoIndex);
    } catch (error) {
      console.error('Error parsing the best photo result:', error);
      throw new Error('Failed to parse the best photo result');
    }
  }
}
