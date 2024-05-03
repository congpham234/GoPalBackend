import { singleton } from 'tsyringe';
import axios from 'axios';
import {
  SearchAttractionInput,
  SearchAttractionLocationInput,
  SearchAttractionLocationOutput,
  SearchAttractionOutput,
} from './models/attractions';
import { AppConfig, AppConfigKey } from '../../app-config';
import { SearchHotelDestinationOutput } from './models/hotels';

@singleton()
export class BookingDotComFacade {
  private readonly BOOKING_DOT_COM_RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';

  private getRapidApiHeader(): { 'X-RapidAPI-Key': string, 'X-RapidAPI-Host': string } {
    return {
      'X-RapidAPI-Key': AppConfig.getInstance().getValue(AppConfigKey.BOOKING_DOT_COM_API_KEY),
      'X-RapidAPI-Host': this.BOOKING_DOT_COM_RAPIDAPI_HOST,
    };
  }

  public async searchHotelDestination(input: SearchAttractionLocationInput): Promise<SearchHotelDestinationOutput> {
    console.log(input);
    return {
      status: true,
      message: '',
      timestamp: 1,
      data: [],
    };
  }

  public async searchAttractionLocations(input: SearchAttractionLocationInput): Promise<SearchAttractionLocationOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation',
      params: input,
      headers: this.getRapidApiHeader(),
    };
    const response = await axios.request(options);
    return response.data;
  }

  public async searchAttractions(input: SearchAttractionInput): Promise<SearchAttractionOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions',
      params: input,
      headers: this.getRapidApiHeader(),
    };
    const response = await axios.request(options);
    return response.data;
  }
}
