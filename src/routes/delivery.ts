import { Router } from 'express';


const router = Router();


router.get('/delivery', (req, res) => {
  res.send('App running');
});


export default router;

