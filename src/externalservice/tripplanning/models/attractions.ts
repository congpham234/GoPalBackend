export interface SearchAttractionLocationInput {
  // Names of locations, cities, districts, places, countries, counties etc.
  query: string;
  languagecode: string;
}

export interface SearchAttractionLocationOutput {
  status: boolean;
  message: string;
  timestamp: number;
  data: Data;
}

export interface SearchAttractionInput {
  attractionId: string;
  pageNumber: string;
  currency_code: string;
  languagecode: string;
}

export interface SearchAttractionOutput {
  products: Product[];
  destinations: Destination[];
}

export interface Data {
  products: Product[];
  destinations: Destination[];
}

export interface Product {
  id: string;
  __typename: string;
  title: string;
  productId: string;
  productSlug: string;
  taxonomySlug: string;
  cityUfi: number;
  cityName: string;
  countryCode: string;
}

export interface Destination {
  id: string;
  __typename: string;
  ufi: number;
  country: string;
  cityName: string;
  productCount: number;
  cc1: string;
}
