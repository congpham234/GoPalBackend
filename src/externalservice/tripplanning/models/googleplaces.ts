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
  maxWidthPx: string;
  maxHeightPx: string;
}

export interface SearchPhotoOutput {
  photoUri: string;
}

export interface PlacePhoto {
  name: string;
  widthPx: string;
  heightPx: string;
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
  websiteUri: string;
  displayName: DisplayName;
  photos: PlacePhoto[];
  goodForChildren: boolean;
  allowsDogs: boolean;
  accessibilityOptions: AccessibilityOptions;
}
