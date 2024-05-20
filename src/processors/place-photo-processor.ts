import { inject, singleton } from 'tsyringe';
import { GooglePlacesFacade } from '../externalservice/tripplanning/google-places-facade';
import { PixabayFacade } from '../externalservice/photos/pixabay-facade';
import { Photo, SearchPhotosInput, SearchPhotosOutput } from './models/photos';
import { OpenAiFacade } from '../externalservice/ai/open-ai-facade';
import { PhotoSelectionService } from './photo-selection-processor';

@singleton()
export class PlacePhotoProcessor {
  constructor(
    @inject(GooglePlacesFacade) private googlePlacesFacade: GooglePlacesFacade,
    @inject(PixabayFacade) private pixabayFacade: PixabayFacade,
    @inject(OpenAiFacade) private openAiFacade: OpenAiFacade,
    @inject(PhotoSelectionService)
    private photoSelectionService: PhotoSelectionService,
  ) {}

  public async searchPhotos(
    input: SearchPhotosInput,
  ): Promise<SearchPhotosOutput> {
    const allPhotoLists: {
      description: string;
      photos: { photoTag: string; photoId: string }[];
    }[] = [];
    const photoResults: Photo[] = [];
    const photoUriMap = new Map<string, string>();

    // Collect photo lists and store URIs in the map
    for (const query of input.queries) {
      const formattedQuery = query.replace(',', '');
      try {
        const result = await this.pixabayFacade.searchPhotos({
          name: formattedQuery,
          category: 'travel',
        });

        if (result.photos.length > 0) {
          const photosWithId = result.photos.map((photo) => {
            const photoId = this.photoSelectionService.generateUniqueId();
            photoUriMap.set(photoId, photo.photoUri);
            return {
              photoTag: photo.tag,
              photoId: photoId,
            };
          });

          allPhotoLists.push({
            description: formattedQuery,
            photos: photosWithId,
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
    const bestPhotoIds = await this.photoSelectionService.getBestPhotoIds(
      allPhotoLists,
      this.openAiFacade,
    );

    // Process the results
    for (let i = 0; i < input.queries.length; i++) {
      const query = input.queries[i];
      const bestPhotoId = bestPhotoIds[i];

      if (bestPhotoId && allPhotoLists[i].photos.length > 0) {
        const bestPhotoUri = photoUriMap.get(bestPhotoId);
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
}
