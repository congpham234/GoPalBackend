import { inject, singleton } from 'tsyringe';
import { TripPlanningDaoInterface } from './trip-planning-dao-interface';
import { Attraction, SearchAttractionInput } from '../models/attraction';
import { BookingDotComFacade } from '../../externalservice/tripplanning/booking-dot-com-facade';
import { PlanTripInput, PlanTripOutput } from '../models/plan-trip';
import { OpenAiFacade } from '../../externalservice/ai/openai';

@singleton()
export class TripPlanningDao implements TripPlanningDaoInterface {
  constructor(
    @inject(BookingDotComFacade) private bookingDotComFacade: BookingDotComFacade,
    @inject(OpenAiFacade) private openAiFacade: OpenAiFacade,
  ) { }

  public async searchAttractions(input: SearchAttractionInput): Promise<Attraction[]> {
    const result = await this.bookingDotComFacade.searchAttractionLocations({
      query: input.query,
      languagecode: input.languageCode,
    });

    const attractionList: Attraction[] = [];

    if (result.data.products) {
      for (const element of result.data.products) {
        const attraction: Attraction = {
          cityName: element.cityName,
          countryCode: element.countryCode,
          title: element.title,
        };
        attractionList.push(attraction);
      }
    }

    return attractionList;
  }

  public async planTrip(input: PlanTripInput): Promise<PlanTripOutput> {
    const attractionList = await this.searchAttractions({
      query: input.query,
      languageCode: input.languageCode,
    });

    const systemPrompt = 'You are a helpful assistant designed to plan trips from JSON input';
    const userPrompt = this.buildUserJsonPrompt(input, attractionList);

    const answer = await this.openAiFacade.answer(systemPrompt, userPrompt);
    return { placeholder: answer };
  }

  private buildUserJsonPrompt(input: PlanTripInput, attractionList: Attraction[]): string {
    const jsonPrompt = {
      numOfDays: input.numOfDays,
      attractionList: attractionList,
    };

    return JSON.stringify(jsonPrompt);
  }
}
