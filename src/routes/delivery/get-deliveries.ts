import { Router } from 'express';
import { container } from 'tsyringe';
import { GetDeliveryHandler } from '../../handlers/v1/get-delivery-handler';

const deliveryHandlerInstance = container.resolve(GetDeliveryHandler);

const getDeliveries = (router: Router): void => {
  router.get('/v1/delivery', (req, res) => {
    deliveryHandlerInstance.getDelivery(req, res);
  });
};

export default getDeliveries;
