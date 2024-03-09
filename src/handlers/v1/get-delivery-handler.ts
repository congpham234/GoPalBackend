import { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { GetDeliveriesDao } from '../../daos/get-deliveries-dao';
import { DeliveryNotFoundException } from '../../exceptions/delivery-not-found-exception';

const deliveriesDao = Container.get(GetDeliveriesDao);

@Service()
export class GetDeliveryHandler {
  public async getDelivery(req: Request, res: Response): Promise<void> {
    try {
      const delivery = await deliveriesDao.getDeliveryById('delivery789', 'order123');
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
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}
