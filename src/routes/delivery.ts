import { Router } from 'express';


const router = Router();


/**

 *  @swagger

*  /delivery:

 *   get:

 *    responses:

 *     200:

 *       description: Hello world

 */

router.get('/delivery', (req, res) => {
  res.send('App running');
});


export default router;

