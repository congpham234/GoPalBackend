import { Router, Request, Response, NextFunction } from 'express'; // Import additional types for request, response, and next function
import { container } from 'tsyringe';
import { SearchDestinationHandler } from '../handlers/v1/search-destination-handler'; // Ensure path accuracy

// Resolve the handler immediately before function definition might cause scope issues if this module is imported multiple times.
const searchDestination = (router: Router): void => {
  const handler = container.resolve(SearchDestinationHandler);

  router.get('/v1/search-destination', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // query is string
      const query = req.query.query;
      if (typeof query !== 'string' || query.trim() === '') {
        res.status(400).send('Query parameter is required and must be a non-empty string.');
        return;
      }
      const searchResult = await handler.process(query);
      res.json(searchResult);
    } catch (error) {
      next(error); // Pass errors to Express error handling middleware
    }
  });
};

export default searchDestination;
