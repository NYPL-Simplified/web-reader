const express = require('express');
const request = require('request');
const app = express();
const port = process.env.PORT | 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  // read query parameters
  const requestUrl = req.query['requestUrl'];

  // make request to IEX API and forward response
  request(requestUrl).pipe(res);
});

app.listen(port, () =>
  console.log(`CORS Proxy Listening on: http://localhost:${port}`)
);
