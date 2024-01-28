import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('App running 👍');
});

router.get('/api/hello', (req, res) => {
  res.json({message: 'Hello from Express Lambda!'});
});

export default router;
