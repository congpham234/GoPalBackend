import { Destination as ExternalDestination } from '../externalservice/tripplanning/models/hotels';
import { Destination } from '../processors/models/destinations';

export function mapExternalDestinationToDestination(externalDest: ExternalDestination): Destination {
  return {
    destId: externalDest.dest_id,
    destType: externalDest.dest_type,
    cityName: externalDest.city_name,
    label: externalDest.label,
    region: externalDest.region,
    name: externalDest.name,
    country: externalDest.country,
    imageUrl: externalDest.image_url,
  };
}
