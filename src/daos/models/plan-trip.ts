export interface PlanTripInput {
  // Names of locations, cities, districts, places, countries, counties etc.
  query: string;
  languageCode: string;
  numOfDays: string;
}

export interface PlanTripOutput {
  placeholder: string
}
