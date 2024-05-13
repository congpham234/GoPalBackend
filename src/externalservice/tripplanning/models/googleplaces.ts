export interface SearchPlacesInput {
  textQuery: string;
  maxResultCount: number;
}

export interface SearchPlacesOutput {
  places: Place[];
}

export interface SearchPlaceWithPhotoInput {
  textQuery: string;
}

export interface SearchPlaceWithPhotoOutput {
  place: Place;
  photoUri: string;
}

export interface SearchPhotoInput {
  name: string;
  maxWidthPx: number;
  maxHeightPx: number;
}

export interface SearchPhotoOutput {
  photoUri: string;
}

export interface PlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
}

export interface DisplayName {
  text: string;
  languageCode: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface AccessibilityOptions {
  wheelchairAccessibleParking: boolean;
  wheelchairAccessibleEntrance: boolean;
}

export interface Place {
  formattedAddress: string;
  location: Location;
  googleMapsUri: string;
  displayName: DisplayName;
  photos: PlacePhoto[];
  accessibilityOptions: AccessibilityOptions;
  goodForChildren?: boolean;
  allowsDogs?: boolean;
  websiteUri?: string;
}
