import { Destination as ExternalDestination } from '../externalservice/tripplanning/models/hotels';
import { Destination } from '../processors/models/destinations';

export function mapExternalDestinationToDestination(
  externalDest: ExternalDestination,
): Destination {
  const imageUrl150 = externalDest.image_url;
  let imageUrl1000 = '';
  if (imageUrl150) {
    imageUrl1000 = imageUrl150.replace('/150x150/', '/1000x1000/');
  }

  return {
    destId: externalDest.dest_id,
    destType: externalDest.dest_type,
    cityName: externalDest.city_name,
    label: externalDest.label,
    region: externalDest.region,
    name: externalDest.name,
    country: externalDest.country,
    imageUrl: {
      url150px: imageUrl150,
      url1000px: imageUrl1000,
    },
  };
}
