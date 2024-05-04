import { GetItineraryRequestContent, GetItineraryResponseContent, PlaceToStay, Day as PlanningDay } from 'gopalapimodel';
import { TripPlanningProcessor } from '../../processors/trip-planning-processor';
import { inject, singleton } from 'tsyringe';
import { Day, PlanTripOutput } from '../../processors/models/plan-trip';
import { calculateDaysBetweenDates } from '../../helpers/date-time-helper';
import { DestinationSearchProcessor } from '../../processors/destination-search-processor';
import { Hotel, SearchDestinationHotelsOutput } from '../../processors/models/hotels';

@singleton()
export class GetItineraryHandler {
  constructor(
    @inject(TripPlanningProcessor) private tripPlanningProcessor: TripPlanningProcessor,
    @inject(DestinationSearchProcessor) private destinationSearchProcessor: DestinationSearchProcessor,
  ) { }

  public async process(request: GetItineraryRequestContent): Promise<GetItineraryResponseContent> {
    // TODO: Add DATE validation here;
    const totalDays = calculateDaysBetweenDates(request.startDate, request.endDate);

    const searchDestinationHotelsOutput: SearchDestinationHotelsOutput = await this.destinationSearchProcessor.searchDestinationHotels({
      destId: request.destination.destId,
      searchType: request.destination.destType,
      startDate: request.startDate,
      endDate: request.endDate,
      numOfPeople: request.numOfPeople.toString(),
    });

    // TODO: Add Validation for searchDestinationHotelsOutput
    const planTripOutput: PlanTripOutput = await this.tripPlanningProcessor.planTrip({
      query: request.destination.name,
      country: request.destination.country,
      numOfDays: totalDays,
    });

    const placesToStay: PlaceToStay[] = [];

    searchDestinationHotelsOutput.hotels.forEach((hotel: Hotel) => {
      placesToStay.push(this.mapHotelToPlaceToStay(hotel));
    });

    const planningDays: PlanningDay[] = [];

    planTripOutput.itinerary.forEach((day: Day) => {
      planningDays.push(this.mapDayToPlanningDay(day));
    });

    return {
      placesToStay,
      planningDays,
    };
  }

  private mapDayToPlanningDay(input: Day): PlanningDay {
    return input;
  }

  private mapHotelToPlaceToStay(input: Hotel): PlaceToStay {
    return {
      name: input.name,
      reviewScore: input.reviewScore,
      reviewCount: input.reviewCount,
      suggestedPrice: input.price.value,
      currency: input.price.currency,
      photoUrl: input.photoUrls.at(0),
    };
  }
}
