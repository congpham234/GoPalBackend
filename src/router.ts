import { Router } from 'express';
import getItinerary from './routes/get-itinerary';
import searchDestination from './routes/search-destination';
import getBeer from './routes/get-beer';

const createRouter = (): Router => {
  const router = Router();
  getBeer(router);
  getItinerary(router);
  searchDestination(router);
  return router;
};

export default createRouter;
