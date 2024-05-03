import { inject, singleton } from 'tsyringe';
import { BookingDotComFacade } from '../externalservice/tripplanning/booking-dot-com-facade';
import { SearchHotelDestinationOutput, SearchHotelsOutput, Destination, Hotel as ExternalHotel } from '../externalservice/tripplanning/models/hotels';
import { SearchDestinationHotelsInput, SearchDestinationHotelsOutput, Hotel } from './models/hotels';

@singleton()
export class DestinationSearchProcessor {
  constructor(
    @inject(BookingDotComFacade) private bookingDotComFacade: BookingDotComFacade,
  ) { }

  public async searchDestinationHotels(input: SearchDestinationHotelsInput): Promise<SearchDestinationHotelsOutput> {
    try {
      const destinationOutput: SearchHotelDestinationOutput = await this.bookingDotComFacade.searchHotelDestination({
        query: input.query,
      });
      if (destinationOutput.data.length === 0) {
        throw new Error('No destinations found for the given query.');
      }
      // TODO: Make this dynamic or something.
      const firstDestination: Destination = destinationOutput.data[0]; // Access the first item safely

      const hotelsOutput: SearchHotelsOutput = await this.bookingDotComFacade.searchHotels({
        dest_id: firstDestination.dest_id,
        search_type: firstDestination.dest_type.toUpperCase(),
        arrival_date: input.startDate,
        departure_date: input.endDate,
        adults: input.numOfPeople.toString(),
      });

      // Limit the results to 5 hotels.
      // TODO: think of a way to cache this
      const limitedHotels: ExternalHotel[] = hotelsOutput.data.hotels.slice(0, 5);

      // Properly initialize the hotels array with type Hotel[]
      const hotels: Hotel[] = [];

      // Use forEach to iterate over limitedHotels of type ExternalHotel[]
      limitedHotels.forEach((externalHotel: ExternalHotel) => {
        hotels.push(this.mapToHotel(externalHotel));
      });

      return {
        country: firstDestination.country,
        name: firstDestination.name,
        city_name: firstDestination.city_name,
        label: firstDestination.label,
        region: firstDestination.region,
        image_url: firstDestination.image_url,
        hotels,
      };
    } catch (error) {
      // Handle errors appropriately, e.g., log them or rethrow
      console.error('Failed to search hotels:', error);
      throw error;
    }
  }

  private mapToHotel(input: ExternalHotel): Hotel {
    return {
      name: input.property.name,
      reviewCount: input.property.reviewCount,
      reviewScore: input.property.reviewScore,
      countryCode: input.property.countryCode,
      price: input.property.priceBreakdown.grossPrice,
      photoUrls: input.property.photoUrls,
    };
  }
}
