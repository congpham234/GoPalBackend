export class DeliveryNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeliveryNotFound';
    // Ensure stack trace is captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeliveryNotFoundException);
    }
  }
}
