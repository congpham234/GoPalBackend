import { Router } from 'express';
import { container } from 'tsyringe';
import { GetDeliveryHandler } from '../../handlers/v1/get-delivery-handler';

const deliveryHandlerInstance = container.resolve(GetDeliveryHandler);

const getDeliveries = (router: Router): void => {
  // next param is used as error handling in ExpressJS 5
  // https://expressjs.com/en/guide/error-handling.html
  // eslint-disable-next-line
  router.get('/v1/delivery', async (req, res, next) => {
    const deliveryId = req.query.deliveryId?.toString() ?? '';
    const delivery = await deliveryHandlerInstance.getDelivery(deliveryId);
    res.send(delivery);
  });
};

export default getDeliveries;
