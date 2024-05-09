import { Router, Request, Response, NextFunction } from 'express'; // Import additional types for request, response, and next function

// Resolve the handler immediately before function definition might cause scope issues if this module is imported multiple times.
const getBeer = (router: Router): void => {
  router.get(
    '/v1/get-beer',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.json({
          beer: 'Corona',
        });
      } catch (error) {
        next(error); // Pass errors to Express error handling middleware
      }
    },
  );
};

export default getBeer;
