import { Router } from 'express';
import getDeliveries from './delivery/get-deliveries';

const createRouter = (): Router => {
  const router = Router();
  getDeliveries(router);
  return router;
};

export default createRouter;
