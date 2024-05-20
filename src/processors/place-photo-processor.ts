import { inject, singleton } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have this library installed
import { GooglePlacesFacade } from '../externalservice/tripplanning/google-places-facade';
import { PixabayFacade } from '../externalservice/photos/pixabay-facade';
import { Photo, SearchPhotosInput, SearchPhotosOutput } from './models/photos';
import { PhotoSelectionService } from './photo-selection-processor';

interface PhotoList {
  description: string;
  photos: { photoTag: string; photoId: string; photoUri: string }[];
}

@singleton()
export class PlacePhotoProcessor {
  constructor(
    @inject(GooglePlacesFacade) private googlePlacesFacade: GooglePlacesFacade,
    @inject(PixabayFacade) private pixabayFacade: PixabayFacade,
    @inject(PhotoSelectionService)
    private photoSelectionService: PhotoSelectionService,
  ) {}

  public async searchPhotos(
    input: SearchPhotosInput,
  ): Promise<SearchPhotosOutput> {
    const photoUriMap = new Map<string, string | null>();
    const uuids: string[] = input.queries.map(() => uuidv4());

    // Collect photo lists and store URIs in the map
    const photoMapLists = await this.collectPhotoLists(uuids, input.queries);

    // Convert the map to an array of PhotoList
    const photoLists: PhotoList[] = Array.from(photoMapLists.values());

    // Determine the best photos using a single OpenAI call
    const bestPhotoIds =
      await this.photoSelectionService.getBestPhotoIds(photoLists);

    // Process the results
    await this.processPhotoResults(
      uuids,
      bestPhotoIds,
      photoUriMap,
      photoMapLists,
    );

    // Map the photo results to the expected output format
    const photos = uuids.map((uuid) => ({
      photoUri: photoUriMap.get(uuid) || '',
    }));

    return { photos };
  }

  private async collectPhotoLists(
    uuids: string[],
    queries: string[],
  ): Promise<Map<string, PhotoList>> {
    const photoLists = new Map<string, PhotoList>();

    await Promise.all(
      uuids.map(async (uuid, index) => {
        const query = queries[index];
        const formattedQuery = query.replace(',', '');
        try {
          const result = await this.pixabayFacade.searchPhotos({
            name: formattedQuery,
            category: 'travel',
          });

          const photosWithId = result.photos.map((photo) => ({
            photoTag: photo.tag,
            photoId: this.photoSelectionService.generateUniqueId(),
            photoUri: photo.photoUri,
          }));

          photoLists.set(uuid, {
            description: query,
            photos: photosWithId,
          });
        } catch (error) {
          console.error(`Error processing query "${query}":`, error);
          photoLists.set(uuid, {
            description: query,
            photos: [],
          });
        }
      }),
    );

    return photoLists;
  }

  private async processPhotoResults(
    uuids: string[],
    bestPhotoIds: string[],
    photoUriMap: Map<string, string | null>,
    photoMapLists: Map<string, PhotoList>,
  ): Promise<void> {
    uuids.forEach((uuid, i) => {
      const bestPhotoId = bestPhotoIds[i];
      const photoList = photoMapLists.get(uuid);
      if (photoList) {
        const bestPhoto = photoList.photos.find(
          (photo) => photo.photoId === bestPhotoId,
        );
        photoUriMap.set(uuid, bestPhoto ? bestPhoto.photoUri : null);
      } else {
        photoUriMap.set(uuid, null);
      }
    });

    await Promise.all(
      uuids.map(async (uuid) => {
        if (photoUriMap.get(uuid) === null) {
          const query = photoMapLists.get(uuid)?.description;
          if (query) {
            const fallbackResult = await this.fallbackToGooglePhotos(query);
            photoUriMap.set(uuid, fallbackResult.photoUri);
          }
        }
      }),
    );
  }

  private async fallbackToGooglePhotos(query: string): Promise<Photo> {
    try {
      const googlePhoto = await this.googlePlacesFacade.searchPlaceWithPhoto({
        textQuery: query,
      });
      return { photoUri: googlePhoto.photoUri } as Photo;
    } catch (googleError) {
      console.error(
        `Error processing Google Photos fallback for query "${query}":`,
        googleError,
      );
      return { photoUri: '' } as Photo;
    }
  }
}
