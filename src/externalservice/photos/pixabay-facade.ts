import { inject, singleton } from 'tsyringe';
import axios from 'axios';
import { AppConfig, AppConfigKey } from '../../app-config';
import {
  SearchPhotosInput,
  SearchPhotosOutput,
  Photo,
} from './models/pixabay-model';

@singleton()
export class PixabayFacade {
  constructor(@inject(AppConfig) private appConfig: AppConfig) {}

  private readonly API_HOST = 'pixabay.com';

  /* eslint-disable */
  private async fetchFromApi(path: string, apiName: string, params: any) {
    const apiKey = await this.appConfig.getValue(AppConfigKey.PIXABAY_API_KEY);
    const options = {
      method: 'GET',
      url: `https://${this.API_HOST}${path}`,
      params: { key: apiKey, ...params },
      headers: {},
    };
    console.log(
      `Calling ${apiName} API with options: ${JSON.stringify(options)}`
    );
    const response = await axios.request(options);
    return response.data;
  }

  public async searchPhotos(
    input: SearchPhotosInput
  ): Promise<SearchPhotosOutput> {
    const endpoint = `/api/`;
    const params = {
      q: input.name,
      image_type: 'photo',
      per_page: 20,
      page: 1,
      category: input.category,
      safesearch: true,
    };
    const data = await this.fetchFromApi(endpoint, 'searchPhotos', params);

    // Transform the response into the desired output format
    const photos: Photo[] = data.hits.map((hit: any) => ({
      photoUri: hit.webformatURL,
      tag: hit.tags,
    }));

    return {
      photos: photos,
    };
  }
}
