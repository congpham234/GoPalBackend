import { SearchDestinationResponseContent } from 'gopalapimodel';
import { inject, singleton } from 'tsyringe';
import { DestinationSearchProcessor } from '../../processors/destination-search-processor';
import { SearchDestinationsOutput } from '../../processors/models/destinations';

@singleton()
export class SearchDestinationHandler {
  constructor(
    @inject(DestinationSearchProcessor) private destinationSearchProcessor: DestinationSearchProcessor,
  ) { }

  public async process(query: string): Promise<SearchDestinationResponseContent> {
    const results: SearchDestinationsOutput = await this.destinationSearchProcessor.searchDestinations({ query });
    return this.mapResultToClientInterface(results);
  }

  private mapResultToClientInterface(input: SearchDestinationsOutput): SearchDestinationResponseContent {
    return input;
  }
}
