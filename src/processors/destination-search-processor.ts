import { inject, singleton } from 'tsyringe';
import { BookingDotComFacade } from '../externalservice/tripplanning/booking-dot-com-facade';
import {
  SearchHotelDestinationOutput,
  SearchHotelsOutput,
  Destination as ExternalDestination,
  Hotel as ExternalHotel,
} from '../externalservice/tripplanning/models/hotels';
import {
  SearchDestinationHotelsInput,
  SearchDestinationHotelsOutput,
  Hotel,
} from './models/hotels';
import {
  Destination,
  SearchDestinationsInput,
  SearchDestinationsOutput,
} from './models/destinations';
import { mapExternalDestinationToDestination } from '../utils/mapping';

@singleton()
export class DestinationSearchProcessor {
  constructor(
    @inject(BookingDotComFacade)
    private bookingDotComFacade: BookingDotComFacade,
  ) {}

  public async searchDestinations(
    input: SearchDestinationsInput,
  ): Promise<SearchDestinationsOutput> {
    const destinationOutput: SearchHotelDestinationOutput =
      await this.bookingDotComFacade.searchHotelDestination(input);

    const destinations: Destination[] = [];
    destinationOutput.data.forEach((externalDest: ExternalDestination) => {
      destinations.push(mapExternalDestinationToDestination(externalDest));
    });
    return {
      destinations,
    };
  }

  public async searchDestinationHotels(
    input: SearchDestinationHotelsInput,
  ): Promise<SearchDestinationHotelsOutput> {
    try {
      const hotelsOutput: SearchHotelsOutput =
        await this.bookingDotComFacade.searchHotels({
          dest_id: input.destId,
          search_type: input.searchType.toUpperCase(),
          arrival_date: input.startDate,
          departure_date: input.endDate,
          adults: input.numOfPeople.toString(),
        });

      // Properly initialize the hotels array with type Hotel[]
      const hotels: Hotel[] = [];

      // Use forEach to iterate over limitedHotels of type ExternalHotel[]
      hotelsOutput.data.hotels.forEach((externalHotel: ExternalHotel) => {
        hotels.push(this.mapToHotel(externalHotel));
      });

      return {
        hotels,
      };
    } catch (error) {
      // Handle errors appropriately, e.g., log them or rethrow
      console.error('Failed to search hotels:', error);
      throw error;
    }
  }

  private mapToHotel(input: ExternalHotel): Hotel {
    const photoUrls = [];
    for (const url of input.property.photoUrls) {
      const resizedPhoto = this.resize1024x768(url);
      photoUrls.push(resizedPhoto);
    }

    return {
      name: input.property.name,
      reviewCount: input.property.reviewCount,
      reviewScore: input.property.reviewScore,
      countryCode: input.property.countryCode,
      price: input.property.priceBreakdown.grossPrice,
      photoUrls: photoUrls,
    };
  }

  private resize1024x768(url: string) {
    return url.replace(/\/[^/]+\/(\d+\.jpg)/, '/max1024x768/$1');
  }
}
