import { TripPlanningProcessor } from '../../src/processors/trip-planning-processor';
import { mock, instance, when, verify, anyString, deepEqual } from 'ts-mockito';
import { OpenAiFacade } from '../../src/externalservice/ai/open-ai-facade';
import { PlanTripInput } from '../../src/processors/models/plan-trip';
import { PlacePhotoProcessor } from '../../src/processors/place-photo-processor';
import { Photo, SearchPhotosOutput } from '../../src/processors/models/photos';

describe('TripPlanningProcessor', () => {
  let tripPlanningProcessor: TripPlanningProcessor;
  let mockOpenAiFacade: OpenAiFacade;
  let mockPlacePhotoProcessor: PlacePhotoProcessor;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    mockOpenAiFacade = mock(OpenAiFacade);
    mockPlacePhotoProcessor = mock(PlacePhotoProcessor);
    tripPlanningProcessor = new TripPlanningProcessor(
      instance(mockOpenAiFacade),
      instance(mockPlacePhotoProcessor),
    );

    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  it('should call OpenAiFacade with correct prompts and parse the JSON response', async () => {
    const input: PlanTripInput = {
      numOfDays: 3,
      query: 'Tokyo, Japan',
    };
    const fakeResponse = JSON.stringify({
      itinerary: [],
    });
    when(
      mockOpenAiFacade.answer(
        'You only return the JSON response with the exact given format {"itinerary":[{"dayNumber":"the type is number and it is unique in the list, each day should have 3 activities","activities":[{"activityName":"the name of the activity, for example \\"Exploring Stanley Park\\"","location":"the location name for example \\"Stanley Park, Vancouver\\". Location must be from the activityName","description":"a few sentences about this location or activity"}]}]}',
        'Can you help me plan a 3 days trip at or within 50km of Tokyo, Japan?',
      ),
    ).thenResolve(fakeResponse);

    const result = await tripPlanningProcessor.planTrip(input);

    verify(mockOpenAiFacade.answer(anyString(), anyString())).once();
    expect(result).toEqual({ itinerary: [] });
  });

  it('should handle JSON parsing errors', async () => {
    const input: PlanTripInput = {
      numOfDays: 3,
      query: 'Tokyo, Japan',
    };
    when(mockOpenAiFacade.answer(anyString(), anyString())).thenResolve(
      'invalid json',
    );

    await expect(tripPlanningProcessor.planTrip(input)).rejects.toThrow(
      'Failed to parse trip planning response',
    );
  });

  it('should update activities with details from PlacePhotoProcessor', async () => {
    const input: PlanTripInput = {
      numOfDays: 3,
      query: 'Tokyo',
    };
    const fakeResponse = JSON.stringify({
      itinerary: [
        {
          dayNumber: 1,
          activities: [
            {
              activityName: 'Hanging out',
              location: 'Shinjuku Gyoen',
              description: 'A beautiful park in Tokyo',
            },
          ],
        },
      ],
    });
    const expectedPhotosOutput: SearchPhotosOutput = {
      photos: [
        {
          photoUri: 'http://example.com/photo.jpg',
        } as Photo,
      ],
    };
    when(mockOpenAiFacade.answer(anyString(), anyString())).thenResolve(
      fakeResponse,
    );
    when(
      mockPlacePhotoProcessor.searchPhotos(
        deepEqual({ queries: ['Shinjuku Gyoen'] }),
      ),
    ).thenResolve(expectedPhotosOutput);

    const result = await tripPlanningProcessor.planTrip(input);

    verify(
      mockPlacePhotoProcessor.searchPhotos(
        deepEqual({ queries: ['Shinjuku Gyoen'] }),
      ),
    ).once();

    expect(result.itinerary[0].activities[0].detail).toEqual({
      photoUri: 'http://example.com/photo.jpg',
    });
  });
});
