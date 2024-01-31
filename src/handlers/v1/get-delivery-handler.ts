import { Request, Response } from 'express';
import mockDeliveries from '../../mocks/mock-deliveries';

const getDeliveryHandler = (req: Request, res: Response): void => {
  // TODO: add Request and Response Validation
  res.json(mockDeliveries);
};

export default getDeliveryHandler;
