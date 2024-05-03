import { Router } from 'express';
import getItinerary from './get-itinerary';

const createRouter = (): Router => {
  const router = Router();
  getItinerary(router);
  return router;
};

export default createRouter;
