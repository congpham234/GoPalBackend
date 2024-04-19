import { Router } from 'express';
import getDeliveries from './delivery/get-deliveries';
import getAnswer from './delivery/get-answer';

const createRouter = (): Router => {
  const router = Router();
  getDeliveries(router);
  getAnswer(router);
  return router;
};

export default createRouter;
