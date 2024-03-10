import { Request, Response, NextFunction } from 'express';
import { DeliveryNotFoundException } from '../exceptions/delivery-not-found-exception';

/* eslint-disable */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // dump error to console for debug
  if (err instanceof DeliveryNotFoundException) {
    // TODO: Add DeliveryNotFoundException in the API model
    res.status(404).json({ error: err.message });
  } else {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default errorHandler;
