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
  private readonly BOOKING_DOT_COM_RAPIDAPI_HOST =
    'booking-com15.p.rapidapi.com';

  private getRapidApiHeader(): {
    'X-RapidAPI-Key': string
    'X-RapidAPI-Host': string
    } {
    return {
      'X-RapidAPI-Key': AppConfig.getInstance().getValue(
        AppConfigKey.BOOKING_DOT_COM_API_KEY,
      ),
      'X-RapidAPI-Host': this.BOOKING_DOT_COM_RAPIDAPI_HOST,
    };
  }

  public async searchHotels(
    input: SearchHotelsInput,
  ): Promise<SearchHotelsOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels',
      params: input,
      headers: this.getRapidApiHeader(),
    };

    console.log(`Calling Booking API searchHotels with options: ${options}`);
    const response = await axios.request(options);
    return response.data;
  }

  public async searchHotelDestination(
    input: SearchHotelDestinationInput,
  ): Promise<SearchHotelDestinationOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination',
      params: input,
      headers: this.getRapidApiHeader(),
    };

    console.log(
      `Calling Booking API searchHotelDestination with options: ${options}`,
    );
    const response = await axios.request(options);
    return response.data;
  }

  public async searchAttractionLocations(
    input: SearchAttractionLocationInput,
  ): Promise<SearchAttractionLocationOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation',
      params: input,
      headers: this.getRapidApiHeader(),
    };

    console.log(
      `Calling Booking API searchAttractionLocations with options: ${options}`,
    );
    const response = await axios.request(options);
    return response.data;
  }

  public async searchAttractions(
    input: SearchAttractionInput,
  ): Promise<SearchAttractionOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions',
      params: input,
      headers: this.getRapidApiHeader(),
    };

    console.log(
      `Calling Booking API searchAttractions with options: ${options}`,
    );
    const response = await axios.request(options);
    return response.data;
  }
}
