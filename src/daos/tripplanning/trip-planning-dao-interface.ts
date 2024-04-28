import { Attraction, AttractionLocation } from '../models/attraction';

export interface TripPlanningDaoInterface {
  searchAttractions(): Attraction[];
  searchAttractionLocations(query: string, languagecode: string): Promise<AttractionLocation[]>;
}
