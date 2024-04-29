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

  public async planTrip(query: string, languageCode: string, numOfDays: string): Promise<string> {
    const result = await this.tripPlanningDao.planTrip({
      query,
      languageCode,
      numOfDays,
    });

    if (result) {
      // TODO: write better mapping between internal objects vs client object
      // TODO: Convert this into client objects in generated
      return result.placeholder;
    } else {
      throw new DeliveryNotFoundError('Delivery not found');
    }
  }
}
