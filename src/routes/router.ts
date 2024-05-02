import { Router } from 'express';
import getDeliveries from './delivery/get-deliveries';
import getAnswer from './delivery/get-answer';
import getItinerary from './get-itinerary';

const createRouter = (): Router => {
  const router = Router();
  getDeliveries(router);
  getAnswer(router);
  getItinerary(router);
  return router;
};

export default createRouter;
