import { HttpError } from './http-error';

export class DeliveryNotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}
