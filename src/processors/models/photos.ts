export interface SearchPhotosInput {
  queries: string[];
}

export interface SearchPhotosOutput {
  photos: Photo[];
}

export interface Photo {
  photoUri: string;
}
