export interface SearchDestinationHotelsInput {
  destId: string;
  searchType: string;
  startDate: string;
  endDate: string;
  numOfPeople: string;
  /* example of a label: Kyoto Station, Kyoto, Japan */
  label: string;
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
  mainPhotoUrl: string;
}
