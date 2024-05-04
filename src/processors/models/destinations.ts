export interface SearchDestinationsInput {
  query: string
}

export interface SearchDestinationsOutput {
  destinations: Destination[];
}

export interface Destination {
  destId: string;
  destType: string;
  cityName: string;
  label: string;
  region: string;
  name: string;
  country: string;
  imageUrl: string;
}
