import { Request, Response, NextFunction } from 'express';

/* eslint-disable */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 7. Customize errors
  console.error(err); // dump error to console for debug

  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
};

export default errorHandler;
