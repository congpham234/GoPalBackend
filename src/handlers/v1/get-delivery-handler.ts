import { Request, Response } from 'express';

const getDeliveryHandler = (req: Request, res: Response): void => {
  // Your logic for handling the delivery route
  res.send('App running');
};

export default getDeliveryHandler;
