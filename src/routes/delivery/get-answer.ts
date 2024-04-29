import { Router } from 'express';
import { container } from 'tsyringe';
import { Answer } from '../../../generated';
import { TripPlanningHandler } from '../../handlers/v1/trip-planning-handler';

const handler = container.resolve(TripPlanningHandler);

const getAnswer = (router: Router): void => {
  router.post('/v1/ai', async (req, res, next) => {
    try {
      let answer = '';
      answer = (await handler.planTrip('Vancouver', 'en-us', '3')).toString() ?? '';
      // Create an instance of the Answer model
      const response: Answer = {
        answer,
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  });
};

export default getAnswer;
