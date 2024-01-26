import express from 'express';

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

export default app;