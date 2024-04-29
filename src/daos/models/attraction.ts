export interface Attraction {
  cityName: string,
  countryCode: string,
  country?: string,
  title: string,
}

export interface SearchAttractionInput {
  languageCode: string,
  query: string,
}
