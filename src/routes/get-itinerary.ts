import { Router } from 'express';
import { container } from 'tsyringe';
import { GetItineraryRequestContent } from 'gopalapimodel';
import { GetItineraryHandler } from '../handlers/v1/get-itinerary-handler';

const getItineraryHandler = container.resolve(GetItineraryHandler);

const getItinerary = (router: Router): void => {
  router.post('/v1/get-itinerary', async (req, res, next) => {
    try {
      const request: GetItineraryRequestContent = req.body;
      const test = await getItineraryHandler.process(request);
      res.send({ country: test.destination });
    } catch (error) {
      next(error);
    }
  });
};

export default getItinerary;
