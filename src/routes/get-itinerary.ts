import { Router } from 'express';
import { container } from 'tsyringe';
import {
  GetItineraryRequestContent,
  GetItineraryResponseContent,
} from 'gopalapimodel';
import { GetItineraryHandler } from '../handlers/v1/get-itinerary-handler';

const getItinerary = (router: Router): void => {
  const handler = container.resolve(GetItineraryHandler);

  router.post('/v1/get-itinerary', async (req, res, next) => {
    try {
      const request: GetItineraryRequestContent = req.body;
      const itinerary: GetItineraryResponseContent =
        await handler.process(request);
      res.send(itinerary);
    } catch (error) {
      next(error);
    }
  });
};

export default getItinerary;
