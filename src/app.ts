import express from 'express';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';

const app = express();

if (process.env.ENVIRONMENT !== "lambda") {
  let port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

app.get("/", (req, res) => {
  res.send("App running 👍");
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express Lambda!' });
});

app.use(awsServerlessExpressMiddleware.eventContext())

export default app;