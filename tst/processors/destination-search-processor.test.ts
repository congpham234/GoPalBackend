import { BookingDotComFacade } from '../../src/externalservice/tripplanning/booking-dot-com-facade';
import { Destination as ExternalDestination, SearchHotelDestinationInput, SearchHotelDestinationOutput } from '../../src/externalservice/tripplanning/models/hotels';
import { DestinationSearchProcessor } from '../../src/processors/destination-search-processor';
import { mock, instance, when, deepEqual } from 'ts-mockito';
import { SearchDestinationsOutput } from '../../src/processors/models/destinations';
import { mapExternalDestinationToDestination } from '../../src/utils/mapping';

describe('DestinationSearchProcessor', () => {
  let processor: DestinationSearchProcessor;
  let mockedBookingDotComFacade: BookingDotComFacade;

  beforeEach(() => {
    mockedBookingDotComFacade = mock(BookingDotComFacade);
    processor = new DestinationSearchProcessor(instance(mockedBookingDotComFacade));
  });

  describe('searchDestinations', () => {
    it('should return transformed destinations', async () => {
      const input: SearchHotelDestinationInput = { query: 'DUMMY_QUERY' };

      const mockExternalDestination: ExternalDestination = {
        dest_id: '123',
        dest_type: 'Hotel',
        city_name: 'New York',
        label: 'NY Hotel',
        type: 'Hotel Type',
        region: 'NY Region',
        name: 'The Empire Hotel',
        roundtrip: 'Yes',
        country: 'USA',
        image_url: 'http://example.com/image.jpg',
      };

      const mockOutput: SearchHotelDestinationOutput = {
        status: true,
        message: 'DUMMY_MESSAGE',
        timestamp: 5,
        data: [mockExternalDestination],
      };

      when(mockedBookingDotComFacade.searchHotelDestination(deepEqual(input))).thenResolve(mockOutput);
      const expected: SearchDestinationsOutput = { destinations: [mapExternalDestinationToDestination(mockExternalDestination)] };

      const result = await processor.searchDestinations(input);
      expect(result).toEqual(expected);
    });

    // Add more tests to cover other scenarios, e.g., handling errors
    // Additional test cases to consider:
    // - What happens when the facade throws an error?
    // - Are the results correctly limited to 5 hotels?
    // - Test data transformations and validations
  });
});
