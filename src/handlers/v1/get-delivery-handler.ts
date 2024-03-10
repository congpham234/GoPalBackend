import { Request, Response } from 'express';
import { GetDeliveriesDao } from '../../daos/get-deliveries-dao';
import { DeliveryNotFoundException } from '../../exceptions/delivery-not-found-exception';
import { singleton } from 'tsyringe';

@singleton()
export class GetDeliveryHandler {
  private readonly deliveriesDao: GetDeliveriesDao;

  constructor(deliveriesDao: GetDeliveriesDao) {
    this.deliveriesDao = deliveriesDao;
  }

  public async getDelivery(req: Request, res: Response): Promise<void> {
    try {
      console.log(this.deliveriesDao);
      const delivery = await this.deliveriesDao.getDeliveryById('delivery789', 'order123');
      if (delivery) {
        res.json(delivery);
      } else {
        throw new DeliveryNotFoundException('Delivery not found');
      }
    } catch (err) {
      // TODO: Move these into exception handler class
      if (err instanceof DeliveryNotFoundException) {
        res.status(404).json({ error: err.message });
      } else {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}
