export interface SearchPhotosInput {
  name: string;
  category: string;
}

export interface SearchPhotosOutput {
  photos: Photo[];
}

export interface Photo {
  photoUri: string;
  tag: string;
}
