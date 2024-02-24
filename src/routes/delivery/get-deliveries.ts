import { Router } from 'express';
import { Container } from 'typedi';
import { GetDeliveryHandler } from '../../handlers/v1/get-delivery-handler';

const deliveryHandlerInstance = Container.get(GetDeliveryHandler);

const getDeliveries = (router: Router): void => {
  router.get('/v1/delivery', (req, res) => {
    deliveryHandlerInstance.getDelivery(req, res);
  });
};

export default getDeliveries;
