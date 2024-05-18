import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { SearchDestinationHandler } from '../../../src/handlers/v1/search-destination-handler';
import { DestinationSearchProcessor } from '../../../src/processors/destination-search-processor';
import { SearchDestinationsOutput } from '../../../src/processors/models/destinations';
import { SearchDestinationResponseContent } from 'gopalapimodel';

describe('SearchDestinationHandler', () => {
  let mockedDestinationSearchProcessor: DestinationSearchProcessor;
  let searchDestinationHandler: SearchDestinationHandler;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    mockedDestinationSearchProcessor = mock(DestinationSearchProcessor);
    searchDestinationHandler = new SearchDestinationHandler(
      instance(mockedDestinationSearchProcessor),
    );

    // Mock console.error to prevent actual error logging in tests
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    reset(mockedDestinationSearchProcessor);
    consoleErrorMock.mockRestore();
  });

  it('should throw an error if query is not provided', async () => {
    await expect(searchDestinationHandler.process('')).rejects.toThrow(
      'Query parameter is required.',
    );
  });

  it('should process a search query and return results', async () => {
    const query = 'Paris';
    const mockSearchOutput: SearchDestinationsOutput = {
      destinations: [
        {
          destId: '123',
          destType: 'city',
          cityName: 'Paris',
          label: 'Paris, France',
          region: 'Ile-de-France',
          name: 'Paris',
          country: 'France',
          imageUrl: {
            url150px: 'http://example.com/image150.jpg',
            url1000px: 'http://example.com/image1000.jpg',
          },
        },
      ],
    };

    when(
      mockedDestinationSearchProcessor.searchDestinations(anything()),
    ).thenResolve(mockSearchOutput);

    const result: SearchDestinationResponseContent =
      await searchDestinationHandler.process(query);

    expect(result).toEqual({
      destinations: [
        {
          destId: '123',
          destType: 'city',
          cityName: 'Paris',
          label: 'Paris, France',
          region: 'Ile-de-France',
          name: 'Paris',
          country: 'France',
          imageUrl: {
            url150px: 'http://example.com/image150.jpg',
            url1000px: 'http://example.com/image1000.jpg',
          },
        },
      ],
    });
    verify(
      mockedDestinationSearchProcessor.searchDestinations(anything()),
    ).once();
  });

  it('should handle empty search results gracefully', async () => {
    const query = 'UnknownPlace';
    const mockSearchOutput: SearchDestinationsOutput = {
      destinations: [],
    };

    when(
      mockedDestinationSearchProcessor.searchDestinations(anything()),
    ).thenResolve(mockSearchOutput);

    const result: SearchDestinationResponseContent =
      await searchDestinationHandler.process(query);

    expect(result).toEqual({
      destinations: [],
    });
    verify(
      mockedDestinationSearchProcessor.searchDestinations(anything()),
    ).once();
  });

  it('should throw an error if search fails', async () => {
    const query = 'Paris';

    when(
      mockedDestinationSearchProcessor.searchDestinations(anything()),
    ).thenReject(new Error('Search failed'));

    await expect(searchDestinationHandler.process(query)).rejects.toThrow(
      'Failed to search for destinations. Please try again later.',
    );
    verify(
      mockedDestinationSearchProcessor.searchDestinations(anything()),
    ).once();
    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error processing search destination:',
      expect.any(Error),
    );
  });
});
