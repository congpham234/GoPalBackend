import { inject, singleton } from 'tsyringe';
import axios from 'axios';
import { AppConfig, AppConfigKey } from '../../app-config';
import {
  SearchPhotoInput,
  SearchPhotoOutput,
  SearchPlacesInput,
  SearchPlacesOutput,
  SearchPlaceWithPhotoInput,
  SearchPlaceWithPhotoOutput,
} from './models/googleplaces';

@singleton()
export class GooglePlacesFacade {
  constructor(@inject(AppConfig) private appConfig: AppConfig) {}

  private readonly API_HOST = 'places.googleapis.com';

  private async getGoogleApiHeaders(
    fieldmasks = '*',
  ): Promise<Record<string, string>> {
    return {
      'X-Goog-Api-Key': await this.appConfig.getValue(
        AppConfigKey.GOOGLE_PLACES_API_KEY,
      ),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'X-Goog-FieldMask': fieldmasks,
    };
  }

  /* eslint-disable */
  private async fetchFromApi(
    endpoint: string,
    method: string,
    params?: any,
    fieldmasks?: string
  ): Promise<any> {
    const headers = await this.getGoogleApiHeaders(fieldmasks);
    const options = {
      method,
      url: `https://${this.API_HOST}${endpoint}`,
      headers,
      ...(method === 'POST' ? { data: params } : { params }),
    };

    console.log(
      `Calling Google Places API ${endpoint} with options: ${JSON.stringify(options)}`
    );
    const response = await axios.request(options);
    return response.data;
  }

  public async searchPlaceWithPhoto(
    input: SearchPlaceWithPhotoInput
  ): Promise<SearchPlaceWithPhotoOutput> {
    const result = await this.searchPlaces({
      textQuery: input.textQuery,
      maxResultCount: 1,
    });

    const place = result.places[0];
    if (!place || !place.photos.length) {
      throw new Error('No place or photos found.');
    }

    const firstPhoto = place.photos[0];
    const photoDetails = await this.searchPhoto({
      name: firstPhoto.name,
      maxWidthPx: Math.min(4800, firstPhoto.widthPx),
      maxHeightPx: Math.min(4800, firstPhoto.heightPx),
    });

    return {
      place,
      photoUri: photoDetails.photoUri,
    };
  }

  public async searchPlaces(
    input: SearchPlacesInput
  ): Promise<SearchPlacesOutput> {
    return this.fetchFromApi(
      '/v1/places:searchText',
      'POST',
      input,
      'places.formattedAddress,places.displayName,places.location,places.googleMapsUri,places.photos,places.accessibilityOptions'
    );
  }

  public async searchPhoto(
    input: SearchPhotoInput
  ): Promise<SearchPhotoOutput> {
    const endpoint = `/v1/${input.name}/media?maxHeightPx=${input.maxHeightPx}&maxWidthPx=${input.maxWidthPx}&skipHttpRedirect=true`;
    return this.fetchFromApi(endpoint, 'GET');
  }
}
