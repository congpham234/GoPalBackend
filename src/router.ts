import { Router } from 'express';
import getItinerary from './routes/get-itinerary';
import searchDestination from './routes/search-destination';

const createRouter = (): Router => {
  const router = Router();
  getItinerary(router);
  searchDestination(router);
  return router;
};

export default createRouter;
