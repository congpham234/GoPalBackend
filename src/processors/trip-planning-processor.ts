import { inject, singleton } from 'tsyringe';
import {
  Activity,
  Day,
  PlanTripInput,
  PlanTripOutput,
} from './models/plan-trip';
import { OpenAiFacade } from '../externalservice/ai/open-ai-facade';
import { GooglePlacesFacade } from '../externalservice/tripplanning/google-places-facade';
import { SearchPlaceWithPhotoOutput } from '../externalservice/tripplanning/models/googleplaces';

@singleton()
export class TripPlanningProcessor {
  constructor(
    @inject(OpenAiFacade) private openAiFacade: OpenAiFacade,
    @inject(GooglePlacesFacade) private googlePlacesFacade: GooglePlacesFacade,
  ) {}

  public async planTrip(input: PlanTripInput): Promise<PlanTripOutput> {
    const systemPrompt = `You only return the JSON response with the exact given format ${this.buildJsonPrompt()}`;
    const userPrompt = `Can you help me plan a ${input.numOfDays} days trip at ${input.query}, ${input.country}?`;
    const answer = await this.openAiFacade.answer(systemPrompt, userPrompt);

    let parsedResult: PlanTripOutput;
    try {
      parsedResult = JSON.parse(answer);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      throw new Error('Failed to parse trip planning response');
    }

    await this.updateActivities(parsedResult.itinerary);
    return parsedResult;
  }

  private async updateActivities(itinerary: Day[]) {
    for (const day of itinerary) {
      const promises = day.activities.map(async (activity: Activity) => {
        try {
          const output: SearchPlaceWithPhotoOutput =
            await this.googlePlacesFacade.searchPlaceWithPhoto({
              textQuery: activity.location,
            });
          return {
            ...activity,
            detail: {
              googleMapsUri: output.place.googleMapsUri,
              formattedAddress: output.place.formattedAddress,
              latitude: output.place.location?.latitude,
              longitude: output.place.location?.longitude,
              goodForChildren: output.place.goodForChildren,
              allowsDogs: output.place.allowsDogs,
              wheelchairAccessibleParking:
                output.place.accessibilityOptions?.wheelchairAccessibleParking,
              wheelchairAccessibleEntrance:
                output.place.accessibilityOptions?.wheelchairAccessibleEntrance,
              websiteUri: output.place.websiteUri,
              photoUri: output.photoUri,
            },
          };
        } catch (error) {
          console.error('Error fetching place details:', error);
          return activity;
        }
      });

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
