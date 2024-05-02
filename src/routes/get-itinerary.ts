import { Router } from 'express';
import { GetItineraryRequestContent } from 'gopalapimodel';

const getItinerary = (router: Router): void => {
  router.post('/v1/get-itinerary', async (req, res, next) => {
    try {
      const request: GetItineraryRequestContent = req.body;

      res.send({ country: request.destination });
    } catch (error) {
      next(error);
    }
  });
};

export default getItinerary;
