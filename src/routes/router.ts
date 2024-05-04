import { Router } from 'express';
import getItinerary from './get-itinerary';
import searchDestination from './search-destination';

const createRouter = (): Router => {
  const router = Router();
  getItinerary(router);
  searchDestination(router);
  return router;
};

export default createRouter;
