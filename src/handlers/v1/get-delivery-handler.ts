import { Request, Response } from 'express';
import { Service } from 'typedi';
import mockDeliveries from '../../../tst/mocks/mock-deliveries';

@Service()
export class GetDeliveryHandler {
  public getDelivery(req: Request, res: Response): void {
    res.json(mockDeliveries);
  }
}
