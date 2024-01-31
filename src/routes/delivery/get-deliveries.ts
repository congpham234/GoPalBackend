import { Router } from 'express';
import getDeliveryHandler from '../../handlers/v1/get-delivery-handler';

const getDeliveries = (router: Router): void => {
  router.get('/delivery', (req, res) => {
    getDeliveryHandler(req, res);
  });
};

export default getDeliveries;
