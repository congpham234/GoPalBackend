import { inject, singleton } from 'tsyringe';
import {
  Activity,
  Day,
  PlanTripInput,
  PlanTripOutput,
} from './models/plan-trip';
import { OpenAiFacade } from '../externalservice/ai/open-ai-facade';
import { PlacePhotoProcessor } from './place-photo-processor';

@singleton()
export class TripPlanningProcessor {
  constructor(
    @inject(OpenAiFacade) private openAiFacade: OpenAiFacade,
    @inject(PlacePhotoProcessor) private photoProcessor: PlacePhotoProcessor,
  ) {}

  public async planTrip(input: PlanTripInput): Promise<PlanTripOutput> {
    const systemPrompt = `You only return the JSON response with the exact given format ${this.buildJsonPrompt()}`;
    const userPrompt = `Can you help me plan a ${input.numOfDays} days trip at or within 50km of ${input.query}?`;
    const answer = await this.openAiFacade.answer(systemPrompt, userPrompt);

    let parsedResult: PlanTripOutput;
    try {
      parsedResult = JSON.parse(answer);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      throw new Error('Failed to parse trip planning response');
    }

    await this.updateActivitiesWithDetails(parsedResult.itinerary);
    return parsedResult;
  }

  private async updateActivitiesWithDetails(itinerary: Day[]) {
    for (const day of itinerary) {
      const queries: string[] = day.activities.map(
        (activity: Activity) => `${activity.location}`,
      );

      const photosOutput = await this.photoProcessor.searchPhotos({ queries });
      const promises = day.activities.map(
        async (activity: Activity, index: number) => {
          const photo = photosOutput.photos[index];
          return {
            ...activity,
            detail: {
              photoUri: photo ? photo.photoUri : '',
            },
          };
        },
      );

      const updatedActivities = await Promise.all(promises);
      day.activities = updatedActivities;
    }
  }

  private buildJsonPrompt(): string {
    const jsonPrompt = {
      itinerary: [
        {
          dayNumber:
            'the type is number and it is unique in the list, each day should have 3 activities',
          activities: [
            {
              activityName:
                'the name of the activity, for example "Exploring Stanley Park"',
              location:
                'the location name for example "Stanley Park, Vancouver". Location must be from the activityName',
              description: 'a few sentences about this location or activity',
            },
          ],
        },
      ],
    };
    return JSON.stringify(jsonPrompt);
  }
}
