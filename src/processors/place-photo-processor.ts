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
    const photoResults: Photo[] = [];

    for (const query of input.queries) {
      const formattedQuery = query.replace(',', '');
      try {
        const result = await this.pixabayFacade.searchPhotos({
          name: formattedQuery,
          category: 'travel',
        });

        if (result.photos.length > 0) {
          const bestPhotoIndex = await this.getTheBestPhotoResult(
            result.photos.map((photo, index) => ({
              photoTag: photo.tag,
              photoIndex: index,
            })),
            formattedQuery,
          );

          const bestPhoto = result.photos[bestPhotoIndex];
          if (bestPhoto) {
            photoResults.push(bestPhoto);
          } else {
            throw new Error('No valid best photo index found');
          }
        } else {
          throw new Error('No photos found from Pixabay');
        }
      } catch (error) {
        console.error(
          `Error processing query "${query}" or no photos found from Pixabay, falling back to Google Photos:`,
          error,
        );
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

  private async getTheBestPhotoResult(
    photoList: { photoTag: string; photoIndex: number }[],
    description: string,
  ): Promise<number> {
    const systemPrompt =
      'You only return the JSON response with the exact given format: {"photoIndex": number}, if there is no best match then return {"photoIndex": -1}';
    const userPrompt = `Can you help me find the best photo in this list ${JSON.stringify(photoList)} that best match for the description: "${description}"?`;
    const answer = await this.openAiFacade.answer(systemPrompt, userPrompt);

    try {
      const response = JSON.parse(answer);
      if (typeof response.photoIndex !== 'number') {
        throw new Error('The response is not a valid structure');
      }
      return response.photoIndex;
    } catch (error) {
      console.error('Error parsing the best photo result:', error);
      throw new Error('Failed to parse the best photo result');
    }
  }
}
