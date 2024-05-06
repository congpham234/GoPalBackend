import { Request, Response, NextFunction } from 'express';

/* eslint-disable */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // dump error to console for debug
  console.error(err)
  res
    .status(err.status || 500)
    .send({ message: err.message || 'Internal Server Error' })
}

export default errorHandler
