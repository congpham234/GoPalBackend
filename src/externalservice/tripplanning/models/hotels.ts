export interface SearchHotelDestinationOutput {
  status: boolean;
  message: string;
  timestamp: number;
  data: Destination[];
}

export interface SearchHotelDestinationInput {
  // Names of locations, cities, districts, places, countries, counties etc.
  query: string;
}

export interface Destination {
  dest_id: string;
  dest_type: string;
  city_name: string;
  label: string;
  type: string;
  region: string;
  name: string;
  roundtrip: string;
  country: string;
  image_url: string;
}

export interface SearchHotelsInput {
  dest_id: string;
  search_type: string; // dest_type
  arrival_date: string;
  departure_date: string;
  adults: string;
}

export interface SearchHotelsOutput {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    hotels: Hotel[];
  };
}

export interface Hotel {
  accessibilityLabel: string;
  property: {
    name: string;
    reviewCount: number;
    reviewScore: number;
    countryCode: string;
    photoUrls: string[];
    mainPhotoId: number;
    priceBreakdown: {
      grossPrice: {
        currency: string;
        value: number;
      };
    };
  };
}
