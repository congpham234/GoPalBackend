import { Request, Response } from 'express';
import mockDeliveries from '../../../tst/mocks/mock-deliveries';

const getDeliveryHandler = (req: Request, res: Response): void => {
  res.json(mockDeliveries);
};

export default getDeliveryHandler;
