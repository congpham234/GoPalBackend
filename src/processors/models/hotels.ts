export interface SearchDestinationHotelsInput {
  destId: string;
  searchType: string;
  startDate: string;
  endDate: string;
  numOfPeople: string;
}

export interface SearchDestinationHotelsOutput {
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
