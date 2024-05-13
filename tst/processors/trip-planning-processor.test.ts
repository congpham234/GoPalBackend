import { TripPlanningProcessor } from '../../src/processors/trip-planning-processor';
import { mock, instance, when, verify, anyString, deepEqual } from 'ts-mockito';
import { OpenAiFacade } from '../../src/externalservice/ai/open-ai-facade';
import { PlanTripInput } from '../../src/processors/models/plan-trip';
import { GooglePlacesFacade } from '../../src/externalservice/tripplanning/google-places-facade';
import { SearchPlaceWithPhotoOutput } from '../../src/externalservice/tripplanning/models/googleplaces';

describe('TripPlanningProcessor', () => {
  let tripPlanningProcessor: TripPlanningProcessor;
  let mockOpenAiFacade: OpenAiFacade;
  let mockGooglePlacesFacade: GooglePlacesFacade;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    mockOpenAiFacade = mock(OpenAiFacade);
    mockGooglePlacesFacade = mock(GooglePlacesFacade);
    tripPlanningProcessor = new TripPlanningProcessor(
      instance(mockOpenAiFacade),
      instance(mockGooglePlacesFacade),
    );

    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original implementation so that it does not affect other tests
    consoleErrorMock.mockRestore();
  });

  it('should call OpenAiFacade with correct prompts and parse the JSON response', async () => {
    const input: PlanTripInput = {
      numOfDays: 3,
      query: 'Tokyo',
      country: 'Japan',
    };
    const fakeResponse = JSON.stringify({
      itinerary: [],
    });
    when(
      mockOpenAiFacade.answer(
        'You only return the JSON response with the exact given format ' +
          tripPlanningProcessor['buildJsonPrompt'](),
        'Can you help me plan a 3 days trip at Tokyo, Japan?',
      ),
    ).thenResolve(fakeResponse);

    const result = await tripPlanningProcessor.planTrip(input);

    verify(mockOpenAiFacade.answer(anyString(), anyString())).once();
    expect(result).toEqual({ itinerary: [] });
  });

  it('should handle JSON parsing errors', async () => {
    const input: PlanTripInput = {
      numOfDays: 3,
      query: 'Tokyo',
      country: 'Japan',
    };
    when(mockOpenAiFacade.answer(anyString(), anyString())).thenResolve(
      'invalid json',
    );

    await expect(tripPlanningProcessor.planTrip(input)).rejects.toThrow(
      'Failed to parse trip planning response',
    );
  });

  it('should update activities with details from GooglePlacesFacade', async () => {
    const input: PlanTripInput = {
      numOfDays: 3,
      query: 'Tokyo',
      country: 'Japan',
    };
    const fakeResponse = JSON.stringify({
      itinerary: [
        {
          dayNumber: 1,
          activities: [{ location: 'Shinjuku Gyoen' }],
        },
      ],
    });
    const expectedPlaceDetails: SearchPlaceWithPhotoOutput = {
      place: {
        googleMapsUri: 'http://maps.google.com/example',
        formattedAddress: 'Shinjuku, Tokyo, Japan',
        location: { latitude: 35.6895, longitude: 139.6917 },
        goodForChildren: true,
        allowsDogs: false,
        displayName: {
          text: 'Dummy display name',
          languageCode: 'en',
        },
        photos: [],
        accessibilityOptions: {
          wheelchairAccessibleParking: true,
          wheelchairAccessibleEntrance: false,
        },
        websiteUri: 'http://example.com',
      },
      photoUri: 'http://example.com/photo.jpg',
    };
    when(mockOpenAiFacade.answer(anyString(), anyString())).thenResolve(
      fakeResponse,
    );
    when(
      mockGooglePlacesFacade.searchPlaceWithPhoto(
        deepEqual({
          textQuery: 'Shinjuku Gyoen',
        }),
      ),
    ).thenResolve(expectedPlaceDetails);

    const result = await tripPlanningProcessor.planTrip(input);

    verify(
      mockGooglePlacesFacade.searchPlaceWithPhoto(
        deepEqual({
          textQuery: 'Shinjuku Gyoen',
        }),
      ),
    ).once();

    expect(result.itinerary[0].activities[0].detail).toEqual({
      googleMapsUri: 'http://maps.google.com/example',
      formattedAddress: 'Shinjuku, Tokyo, Japan',
      latitude: 35.6895,
      longitude: 139.6917,
      goodForChildren: true,
      allowsDogs: false,
      wheelchairAccessibleParking: true,
      wheelchairAccessibleEntrance: false,
      websiteUri: 'http://example.com',
      photoUri: 'http://example.com/photo.jpg',
    });
  });
});
