import { Attraction, AttractionLocation } from '../models/attraction';

export interface TripPlanningDao {
  searchAttractions(): Attraction;
  searchAttractionLocation(): AttractionLocation;
}
