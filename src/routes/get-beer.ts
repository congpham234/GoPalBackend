import { Router, Request, Response, NextFunction } from 'express';

// This is a testing handler. You can change anything here and test it out.
const getBeer = (router: Router): void => {
  router.get(
    '/v1/get-beer',
    async (req: Request, res: Response, next: NextFunction) => {
      // const handler = container.resolve(TripPlanningProcessor);

      // const response = await handler.planTrip({
      //   queries: ["Stanley Park, Vancouver, Canada"],
      // });

      try {
        res.json({
          beer: 'Corona',
        });
      } catch (error) {
        next(error);
      }
    },
  );
};

export default getBeer;
