import { singleton } from 'tsyringe';
import axios from 'axios';
import { bookingDotComApiKey } from '../../middlewares/aws-secrets';
import { SearchAttractionInput, SearchAttractionLocationInput, SearchAttractionLocationOutput, SearchAttractionOutput } from './model/booking-dot-com-model';

@singleton()
export class BookingDotComFacade {
  private readonly BOOKING_DOT_COM_RAPIDAPI_HOST: string = 'booking-com15.p.rapidapi.com';
  private readonly RAPID_API_HEADER: { 'X-RapidAPI-Key': string, 'X-RapidAPI-Host': string };

  constructor() {
    this.RAPID_API_HEADER = {
      'X-RapidAPI-Key': bookingDotComApiKey,
      'X-RapidAPI-Host': this.BOOKING_DOT_COM_RAPIDAPI_HOST,
    };
  }

  public async searchAttractionLocation(input: SearchAttractionLocationInput): Promise<SearchAttractionLocationOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation',
      params: input,
      headers: this.RAPID_API_HEADER,
    };
    const response = await axios.request(options);
    return response.data;
  }

  public async searchAttractions(input: SearchAttractionInput): Promise<SearchAttractionOutput> {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions',
      params: input,
      headers: this.RAPID_API_HEADER,
    };
    const response = await axios.request(options);
    return response.data;
  }

  // public async getAttractionDetails(): Promise<void> {

  // }
}
