import { deepEqual, instance, mock, verify, when } from 'ts-mockito';
import { GetItineraryHandler } from '../../../src/handlers/v1/get-itinerary-handler';
import {
  GetItineraryRequestContent,
  GetItineraryResponseContent,
} from 'gopalapimodel';
import { TripPlanningProcessor } from '../../../src/processors/trip-planning-processor';
import { DestinationSearchProcessor } from '../../../src/processors/destination-search-processor';
import {
  SearchDestinationHotelsOutput,
  Hotel,
} from '../../../src/processors/models/hotels';
import { PlanTripOutput } from '../../../src/processors/models/plan-trip';

// Mock utility function
function setupMocks() {
  const mockedTripPlanningProcessor = mock(TripPlanningProcessor);
  const mockedDestinationSearchProcessor = mock(DestinationSearchProcessor);
  const handler = new GetItineraryHandler(
    instance(mockedTripPlanningProcessor),
    instance(mockedDestinationSearchProcessor),
  );
  return {
    mockedTripPlanningProcessor,
    mockedDestinationSearchProcessor,
    handler,
  };
}

describe('GetItineraryHandler', () => {
  let mockedTripPlanningProcessor: TripPlanningProcessor;
  let mockedDestinationSearchProcessor: DestinationSearchProcessor;
  let handler: GetItineraryHandler;

  beforeEach(() => {
    const mocks = setupMocks();
    mockedTripPlanningProcessor = mocks.mockedTripPlanningProcessor;
    mockedDestinationSearchProcessor = mocks.mockedDestinationSearchProcessor;
    handler = mocks.handler;
  });

  it('should correctly process an itinerary request', async () => {
    const request: GetItineraryRequestContent = {
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      numOfPeople: 2,
      destination: {
        destId: '123',
        destType: 'city',
        name: 'ExampleCity',
        country: 'ExampleCountry',
        label: 'label',
        imageUrl: 'imageUrl',
      },
    };

    const mockedHotels: Hotel[] = [
      {
        name: 'Example Hotel',
        reviewScore: 8.5,
        reviewCount: 150,
        countryCode: 'US',
        price: {
          value: 120,
          currency: 'USD',
        },
        photoUrls: ['http://example.com/photo.jpg'],
      },
    ];

    const mockedHotelOutput: SearchDestinationHotelsOutput = {
      hotels: mockedHotels,
    };

    const mockedPlanTripOutput: PlanTripOutput = {
      itinerary: [
        {
          dayNumber: 1,
          activities: [
            {
              activityName: 'activityName',
              location: 'dummyLocation',
              description: 'dummyDescription',
            },
          ],
        },
      ],
    };

    when(
      mockedDestinationSearchProcessor.searchDestinationHotels(
        deepEqual({
          destId: '123',
          searchType: 'city',
          startDate: '2023-01-01',
          endDate: '2023-01-05',
          numOfPeople: '2',
        }),
      ),
    ).thenResolve(mockedHotelOutput);

    when(
      mockedTripPlanningProcessor.planTrip(
        deepEqual({
          query: 'ExampleCity',
          country: 'ExampleCountry',
          numOfDays: 4,
        }),
      ),
    ).thenResolve(mockedPlanTripOutput);

    const response: GetItineraryResponseContent =
      await handler.process(request);

    expect(response.placesToStay).toEqual([
      {
        name: 'Example Hotel',
        reviewScore: 8.5,
        reviewCount: 150,
        suggestedPrice: 120,
        currency: 'USD',
        photoUrl: 'http://example.com/photo.jpg',
      },
    ]);

    expect(response.planningDays).toEqual([
      {
        dayNumber: 1,
        activities: [
          {
            activityName: 'activityName',
            location: 'dummyLocation',
            description: 'dummyDescription',
          },
        ],
      },
    ]);

    verify(
      mockedDestinationSearchProcessor.searchDestinationHotels(
        deepEqual({
          destId: '123',
          searchType: 'city',
          startDate: '2023-01-01',
          endDate: '2023-01-05',
          numOfPeople: '2',
        }),
      ),
    ).once();

    verify(
      mockedTripPlanningProcessor.planTrip(
        deepEqual({
          query: 'ExampleCity',
          country: 'ExampleCountry',
          numOfDays: 4,
        }),
      ),
    ).once();
  });
});
