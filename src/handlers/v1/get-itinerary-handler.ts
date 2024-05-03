import { GetItineraryRequestContent, GetItineraryResponseContent } from 'gopalapimodel';
import { TripPlanningProcessor } from '../../processors/trip-planning-processor';
import { inject, singleton } from 'tsyringe';
import { PlanTripOutput } from '../../processors/models/plan-trip';
import { calculateDaysBetweenDates } from '../../helpers/date-time-helper';

@singleton()
export class GetItineraryHandler {
  constructor(
    @inject(TripPlanningProcessor) private tripPlanningProcessor: TripPlanningProcessor,
  ) { }

  public async process(request: GetItineraryRequestContent): Promise<GetItineraryResponseContent> {
    const totalDays = calculateDaysBetweenDates(request.startDate, request.endDate);

    // TODO: Add validation here;

    const planTripOutput: PlanTripOutput = await this.tripPlanningProcessor.planTrip({
      query: request.destination,
      country: request.country,
      numOfDays: totalDays,
    });

    return { destination: JSON.stringify(planTripOutput) };
  }
}
