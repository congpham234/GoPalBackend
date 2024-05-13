export interface PlanTripInput {
  // Names of locations, cities, districts, places, counties etc.
  query: string;
  country: string;
  numOfDays: number;
}

export interface PlanTripOutput {
  itinerary: Day[];
}

export interface Day {
  dayNumber: number;
  activities: Activity[];
}

export interface Activity {
  activityName: string;
  location: string;
  description: string;
  googleMapsUri: string;
  formattedAddress: string;
  photoUri: string;
  latitude: number;
  longitude: number;
  goodForChildren?: boolean;
  allowsDogs?: boolean;
  wheelchairAccessibleParking?: boolean;
  wheelchairAccessibleEntrance?: boolean;
  websiteUri?: string;
}
