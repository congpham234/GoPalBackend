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
import { GooglePlacesFacade } from '../externalservice/tripplanning/google-places-facade';

@singleton()
export class DestinationSearchProcessor {
  private readonly HOTEL_LIMIT: number = 9;

  constructor(
    @inject(BookingDotComFacade)
    private bookingDotComFacade: BookingDotComFacade,
    @inject(GooglePlacesFacade) private googlePlacesFacade: GooglePlacesFacade,
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

      // Limit the results to 9 hotels.
      // TODO: think of a way to cache this
      const limitedHotels: ExternalHotel[] = hotelsOutput.data.hotels.slice(
        0,
        this.HOTEL_LIMIT,
      );

      const hotelImageUrls: string[] = await Promise.all(
        limitedHotels.map(async (hotel) => {
          const hotelResultFromGoogle =
            await this.googlePlacesFacade.searchPlaceWithPhoto({
              textQuery: `hotel name ${hotel.property.name} in ${input.label}`,
            });
          return hotelResultFromGoogle.photoUri;
        }),
      );

      const hotels: Hotel[] = [];
      // Use forEach to iterate over limitedHotels of type ExternalHotel[]
      limitedHotels.forEach((externalHotel, index) => {
        const hotelImageUrl = hotelImageUrls[index];
        if (hotelImageUrl) {
          hotels.push(this.mapToHotel(externalHotel, hotelImageUrl));
        }
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

  private mapToHotel(input: ExternalHotel, imageUrl: string): Hotel {
    return {
      name: input.property.name,
      reviewCount: input.property.reviewCount,
      reviewScore: input.property.reviewScore,
      countryCode: input.property.countryCode,
      price: input.property.priceBreakdown.grossPrice,
      photoUrls: input.property.photoUrls,
      mainPhotoUrl: imageUrl,
    };
  }
}
