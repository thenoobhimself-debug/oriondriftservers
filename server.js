const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlfaWQiOiI3ZTljM2EzYy1mNmJkLTQ1MjAtOTlkMi1lYzY2ZWIwNGIwMjEiLCJrZXlfdHlwZSI6InNlcnZpY2UiLCJvd25lcl9pZCI6Ijc3MDI1NzAxMDMxMjU2MTMiLCJjcmVhdGVkX2F0IjoiMjAyNS0wOS0xMyAwNDo1NTo0OC40NTA1MDkifQ.nXDD1sLPY0mJtIVdF4mXHQQL4POs5iKDOIFSfxGgcPI"; 

const ORION_ENDPOINT = "https://a2-station-api-prod-708695367983.us-central1.run.app/v2/stations";

app.get('/stations', async (req, res) => {
  try {
    const response = await fetch(ORION_ENDPOINT, {
      headers: { "x-api-key": API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
