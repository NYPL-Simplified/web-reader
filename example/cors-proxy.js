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

  console.log(`Proxying request to: ${requestUrl}`);

  // make request to IEX API and forward response
  try {
    // allow a 30s timeout
    request(requestUrl, { timeout: 300000 })
      .on('error', (e) => {
        const msg = `Request error at ${requestUrl}: ${e.message}`;
        console.error(e);
        res.status(500);
        res.send(msg);
      })
      .pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(e.message);
  }
});

app.listen(port, () =>
  console.log(`CORS Proxy Listening on: http://localhost:${port}`)
);
