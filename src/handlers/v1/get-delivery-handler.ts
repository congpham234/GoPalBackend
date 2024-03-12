import { Request, Response } from 'express';
import { GetDeliveriesDao } from '../../daos/get-deliveries-dao';
import { DeliveryNotFoundError } from '../../exceptions/delivery-not-found-error';
import { inject, singleton } from 'tsyringe';

@singleton()
export class GetDeliveryHandler {
  private readonly deliveriesDao: GetDeliveriesDao;

  constructor(@inject(GetDeliveriesDao) deliveriesDao: GetDeliveriesDao) {
    this.deliveriesDao = deliveriesDao;
  }

  public async getDelivery(req: Request, res: Response): Promise<void> {
    const delivery = await this.deliveriesDao.getDeliveryById('delivery789');
    if (delivery) {
      res.json(delivery);
    } else {
      throw new DeliveryNotFoundError('Delivery not found');
    }
  }
}
