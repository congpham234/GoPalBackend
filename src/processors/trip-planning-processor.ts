import { inject, singleton } from 'tsyringe';
import { PlanTripInput, PlanTripOutput } from './models/plan-trip';
import { OpenAiFacade } from '../externalservice/ai/openai';

@singleton()
export class TripPlanningProcessor {
  constructor(@inject(OpenAiFacade) private openAiFacade: OpenAiFacade) {}

  public async planTrip(input: PlanTripInput): Promise<PlanTripOutput> {
    const systemPrompt = `You only return the JSON response with the exact given format ${this.buildJsonPrompt()}`;
    const userPrompt = `Can you help me plan a ${input.numOfDays} days trip at ${input.query}, ${input.country}?`;
    const answer = await this.openAiFacade.answer(systemPrompt, userPrompt);

    return JSON.parse(answer);
  }

  private buildJsonPrompt(): string {
    const jsonPrompt = {
      itinerary: [
        {
          dayNumber:
            'the type is number and it is unique in the list, each day should have at least 3 to 5 activities',
          activities: [
            {
              activityName:
                'the name of the activity, for example "Exploring Stanley Park"',
              location: 'the location name for example "Stanley Park"',
              description: 'a few sentences about this location or activity',
            },
          ],
        },
      ],
    };
    return JSON.stringify(jsonPrompt);
  }
}
