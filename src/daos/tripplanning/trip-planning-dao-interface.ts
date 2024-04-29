import { Attraction, SearchAttractionInput } from '../models/attraction';
import { PlanTripInput, PlanTripOutput } from '../models/plan-trip';

export interface TripPlanningDaoInterface {
  searchAttractions(input: SearchAttractionInput): Promise<Attraction[]>;
  planTrip(input: PlanTripInput): Promise<PlanTripOutput>;
}
