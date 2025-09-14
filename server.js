require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
const API_URL = "https://your-deployed-server.com/stations";

const app = express();
const PORT = 3000;

app.use(cors());

// 🔒 Load API key from environment variable
const API_KEY = process.env.ORION_API_KEY;
if (!API_KEY) {
  console.error("❌ Missing ORION_API_KEY environment variable!");
  process.exit(1);
}

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
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});

