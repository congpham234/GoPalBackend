import { inject, singleton } from 'tsyringe';
import { TripPlanningDaoInterface } from './trip-planning-dao-interface';
import { Attraction, AttractionLocation } from '../models/attraction';
import { BookingDotComFacade } from '../../externalservice/tripplanning/booking-dot-com-facade';

@singleton()
export class TripPlanningDao implements TripPlanningDaoInterface {
  constructor(@inject(BookingDotComFacade) private bookingDotComFacade: BookingDotComFacade) {
  }

  public searchAttractions(): Attraction[] {
    throw new Error('Method not implemented.');
  }

  public async searchAttractionLocations(query: string, languagecode: string): Promise<AttractionLocation[]> {
    const result = await this.bookingDotComFacade.searchAttractionLocations({ query, languagecode });
    console.log(result);
    throw new Error('Method not implemented.');
  }
}
