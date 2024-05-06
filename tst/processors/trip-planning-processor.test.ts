import { TripPlanningProcessor } from '../../src/processors/trip-planning-processor';
import { mock, instance, when, verify, anyString } from 'ts-mockito';
import { OpenAiFacade } from '../../src/externalservice/ai/openai';
import { PlanTripInput } from '../../src/processors/models/plan-trip';

describe('TripPlanningProcessor', () => {
  let mockedOpenAiFacade: OpenAiFacade;
  let tripPlanningProcessor: TripPlanningProcessor;

  beforeEach(() => {
    // Create a mock instance of OpenAiFacade
    mockedOpenAiFacade = mock(OpenAiFacade);
    // Create an instance of TripPlanningProcessor with the mocked OpenAiFacade
    tripPlanningProcessor = new TripPlanningProcessor(
      instance(mockedOpenAiFacade),
    );
  });

  it('should return a valid trip plan based on the OpenAI response', async () => {
    // Given
    const input: PlanTripInput = {
      numOfDays: 3,
      query: 'Paris',
      country: 'France',
    };
    const mockAnswer = JSON.stringify({
      itinerary: [
        {
          dayNumber: 1,
          activities: [
            {
              activityName: 'Visit Louvre Museum',
              location: 'Louvre Museum',
              description:
                'Explore the world\'s largest art museum and a historic monument in Paris.',
            },
          ],
        },
      ],
    });

    when(
      mockedOpenAiFacade.answer(
        `You only return the JSON response with the exact given format ${JSON.stringify(
          {
            itinerary: [
              {
                dayNumber:
                  'the type is number and it is unique in the list, each day should have at least 3 to 5 activities',
                activities: [
                  {
                    activityName:
                      'the name of the activity, for example "Exploring Stanley Park"',
                    location: 'the location name for example "Stanley Park"',
                    description:
                      'a few sentences about this location or activity',
                  },
                ],
              },
            ],
          },
        )}`,
        `Can you help me plan a ${input.numOfDays} days trip at ${input.query}, ${input.country}?`,
      ),
    ).thenResolve(mockAnswer);

    // When
    const result = await tripPlanningProcessor.planTrip(input);

    // Then
    expect(result).toEqual(JSON.parse(mockAnswer));
    verify(mockedOpenAiFacade.answer(anyString(), anyString())).once();
  });
  // Additional test cases to handle errors, invalid input, etc.
});
