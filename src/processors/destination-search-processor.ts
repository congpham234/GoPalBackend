import { inject, singleton } from 'tsyringe';
import { Attraction, SearchAttractionInput } from './models/attraction';
import { BookingDotComFacade } from '../externalservice/tripplanning/booking-dot-com-facade';

@singleton()
export class DestinationSearchProcessor {
  constructor(
    @inject(BookingDotComFacade) private bookingDotComFacade: BookingDotComFacade,
  ) { }

  public async searchAttractions(input: SearchAttractionInput): Promise<Attraction[]> {
    const result = await this.bookingDotComFacade.searchAttractionLocations({
      query: input.query,
      languagecode: input.languageCode,
    });

    const attractionList: Attraction[] = [];

    if (result.data.products) {
      for (const element of result.data.products) {
        const attraction: Attraction = {
          cityName: element.cityName,
          countryCode: element.countryCode,
          title: element.title,
        };
        attractionList.push(attraction);
      }
    }

    return attractionList;
  }
}
