
export interface SearchDestinationHotelsInput {
  query: string,
  startDate: string;
  endDate: string;
  numOfPeople: string;
}

export interface SearchDestinationHotelsOutput {
  country: string;
  name: string;
  city_name: string;
  label: string;
  region: string;
  image_url: string;
  hotels: Hotel[];
}

export interface Hotel {
  name: string;
  reviewCount: number;
  reviewScore: number;
  countryCode: string;
  price: {
    currency: string;
    value: number;
  };
  photoUrls: string[];
}
