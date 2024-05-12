import { singleton } from 'tsyringe';
import axios from 'axios';
import {
  SearchAttractionInput,
  SearchAttractionLocationInput,
  SearchAttractionLocationOutput,
  SearchAttractionOutput,
} from './models/attractions';
import { AppConfig, AppConfigKey } from '../../app-config';
import {
  SearchHotelDestinationInput,
  SearchHotelDestinationOutput,
  SearchHotelsInput,
  SearchHotelsOutput,
} from './models/hotels';

@singleton()
export class BookingDotComFacade {
  private readonly API_HOST = 'booking-com15.p.rapidapi.com';

  private async getRapidApiHeader() {
    const appConfigInstance = await AppConfig.getInstance();
    return {
      'X-RapidAPI-Key': appConfigInstance.getValue(
        AppConfigKey.BOOKING_DOT_COM_API_KEY,
      ),
      'X-RapidAPI-Host': this.API_HOST,
    };
  }

  /* eslint-disable */
  private async fetchFromApi(path: string, apiName: string, params: any) {
    const headers = await this.getRapidApiHeader();
    const options = {
      method: 'GET',
      url: `https://${this.API_HOST}/api/v1${path}`,
      params,
      headers: headers,
    };
    console.log(
      `Calling ${apiName} Booking API with options: ${JSON.stringify(options)}`
    );
    const response = await axios.request(options);
    return response.data;
  }

  public searchHotels(input: SearchHotelsInput): Promise<SearchHotelsOutput> {
    return this.fetchFromApi('/hotels/searchHotels', 'searchHotels', input);
  }

  public searchHotelDestination(
    input: SearchHotelDestinationInput
  ): Promise<SearchHotelDestinationOutput> {
    return this.fetchFromApi(
      '/hotels/searchDestination',
      'searchHotelDestination',
      input
    );
  }

  public searchAttractionLocations(
    input: SearchAttractionLocationInput
  ): Promise<SearchAttractionLocationOutput> {
    return this.fetchFromApi(
      '/attraction/searchLocation',
      'searchAttractionLocations',
      input
    );
  }

  public searchAttractions(
    input: SearchAttractionInput
  ): Promise<SearchAttractionOutput> {
    return this.fetchFromApi(
      '/attraction/searchAttractions',
      'searchAttractions',
      input
    );
  }
}
