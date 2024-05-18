import { SearchDestinationResponseContent } from 'gopalapimodel';
import { inject, singleton } from 'tsyringe';
import { DestinationSearchProcessor } from '../../processors/destination-search-processor';
import { SearchDestinationsOutput } from '../../processors/models/destinations';

@singleton()
export class SearchDestinationHandler {
  constructor(
    @inject(DestinationSearchProcessor)
    private destinationSearchProcessor: DestinationSearchProcessor,
  ) {}

  public async process(
    query: string,
  ): Promise<SearchDestinationResponseContent> {
    try {
      const results: SearchDestinationsOutput =
        await this.destinationSearchProcessor.searchDestinations({ query });
      return this.mapResultToClientInterface(results);
    } catch (error) {
      console.error('Error processing search destination:', error);
      throw new Error(
        'Failed to search for destinations. Please try again later.',
      );
    }
  }

  private mapResultToClientInterface(
    input: SearchDestinationsOutput,
  ): SearchDestinationResponseContent {
    return {
      destinations: input.destinations.map((dest) => ({
        destId: dest.destId,
        destType: dest.destType,
        cityName: dest.cityName,
        label: dest.label,
        region: dest.region,
        name: dest.name,
        country: dest.country,
        imageUrl: {
          url150px: dest.imageUrl.url150px,
          url1000px: dest.imageUrl.url1000px,
        },
      })),
    };
  }
}
