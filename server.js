const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlfaWQiOiI3ZTljM2EzYy1mNmJkLTQ1MjAtOTlkMi1lYzY2ZWIwNGIwMjEiLCJrZXlfdHlwZSI6InNlcnZpY2UiLCJvd25lcl9pZCI6Ijc3MDI1NzAxMDMxMjU2MTMiLCJjcmVhdGVkX2F0IjoiMjAyNS0wOS0xMyAwNDo1NTo0OC40NTA1MDkifQ.nXDD1sLPY0mJtIVdF4mXHQQL4POs5iKDOIFSfxGgcPI"; 
const ORION_ENDPOINT = "https://a2-station-api-prod-708695367983.us-central1.run.app/v2/stations";

app.get('/stations', async (req, res) => {
  const { region, fleet, showUsernames } = req.query;

  try {
    let url = ORION_ENDPOINT;
    let allStations = [];
    const seen = new Set();

    // handle pagination
    while (url && !seen.has(url)) {
      seen.add(url);
      const response = await fetch(url, {
        headers: { "x-api-key": API_KEY }
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: `API error ${response.status}` });
      }
      const data = await response.json();
      if (!data.items) break;
      allStations.push(...data.items);
      url = data.next_page_url;
    }

    // filter by fleet + region if provided
    let stations = allStations.filter(s => {
      const matchFleet = fleet ? s.fleet_id === fleet : true;
      const matchRegion = region ? s.region === region : true;
      const not4v4 = !s.station_name.toLowerCase().startsWith("4v4");
      return matchFleet && matchRegion && not4v4;
    });

    // sort by player count
    stations.sort((a, b) => (b.player_count || 0) - (a.player_count || 0));

    // strip players unless explicitly requested
    if (!showUsernames) {
      stations = stations.map(({ players, ...rest }) => rest);
    }

    res.json({ items: stations });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});
