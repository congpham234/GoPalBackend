import { AttractionLocation } from '../../daos/models/attraction';
import { TripPlanningDao } from '../../daos/tripplanning/trip-planning-dao';
import { TripPlanningDaoInterface } from '../../daos/tripplanning/trip-planning-dao-interface';
import { DeliveryNotFoundError } from '../../exceptions/delivery-not-found-error';
import { inject, singleton } from 'tsyringe';

@singleton()
export class TripPlanningHandler {
  private readonly tripPlanningDao: TripPlanningDaoInterface;

  constructor(@inject(TripPlanningDao) tripPlanningDao: TripPlanningDao) {
    this.tripPlanningDao = tripPlanningDao;
  }

  public async planTrip(query: string, languagecode: string): Promise<AttractionLocation[]> {
    const attractions = await this.tripPlanningDao.searchAttractionLocations(query, languagecode);

    if (attractions) {
      // TODO: write better mapping between internal objects vs client object
      // TODO: Convert this into client objects in generated
      return attractions;
    } else {
      throw new DeliveryNotFoundError('Delivery not found');
    }
  }
}
