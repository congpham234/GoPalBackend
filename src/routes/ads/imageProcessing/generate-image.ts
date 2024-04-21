import { Router } from 'express';

const generatePromtImage = (router: Router): void => {
  router.post('/v1/ads/image-processing/generate-prompt-image', async (req, res, next) => {
    try {
      res.send('');
    } catch (error) {
      next(error);
    }
  });
};

export default generatePromtImage;
